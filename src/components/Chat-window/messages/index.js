/* eslint-disable spaced-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/function-component-definition */
import React,{memo, useCallback, useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helper';
import MessageItem from './MessageItem';


const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

function shouldScrollToBottom(node,threshold=30){
  const percentage = (100*node.scrollTop)/(node.scrollHeight-node.clientHeight) || 0;
  
  return percentage > threshold;
}


const Messages = () => {

  const {chatId} = useParams();
  const [messages,setMessages] = useState(null);
  const [limit,setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length===0;
  const canShowMessages = messages && messages.length>0;

  

  const handleDelete = useCallback(async (msgId,file) => {
      if(!window.confirm("Delete this message")){
        return;
      }

      const updates = {};
      const isLast = messages[messages.length-1].id === msgId;
      
      updates[`/messages/${msgId}`] = null;
      if(isLast && messages.length>1){
          updates[`/rooms/${chatId}/lastMessage`] = {
            ...messages[messages.length-2],
            msgId: messages[messages.length-2].id,
          }
      }
      if(isLast && messages.length===1){
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.info('Message deleted',4000);
      } catch (error) {
        return Alert.error(error.message,4000);
      }
      if(file){
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          return Alert.error(error.message,4000);
        }
      }
  },[chatId,messages]);

  const handleAdmin = useCallback(async (uid) => {
    const adminsRef = database.ref(`/rooms/${chatId}/admin`);
    let alertMsg;
    await adminsRef.transaction(admin => {
      console.log(admin);
      if(admin){
      if(admin[uid]){
        admin[uid] = null;
        alertMsg = 'Admin permission removed';
      }
      else{
        admin[uid] = true;
        alertMsg = 'Admin permission granted';
      }
    }
      return admin;
    });
    Alert.info(alertMsg,4000);
  },[chatId]);


  const loadMessages = useCallback((limitToLast) => {

    messagesRef.off();

    messagesRef.orderByChild('roomId')
    .equalTo(chatId)
    .limitToLast(limitToLast || PAGE_SIZE)
    .on('value',snap => {
      const data = transformToArrWithId(snap.val());
      setMessages(data);

      const node = selfRef.current;
      if(shouldScrollToBottom(node)){
        node.scrollTop = node.scrollHeight;
      }
    });
    setLimit(p => p+PAGE_SIZE);
  },[chatId]);


  const onLoadMore = useCallback(() => {

    const node = selfRef.current;
    const oldHeight = node.scrollHeight;
    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight-oldHeight;
    },500);
  },[loadMessages,limit]);



  useEffect(() => {
    const node = selfRef.current;
    loadMessages(limit);


    //here setTimeout is used as loadMessage called above is asynchronous and 
    // node value assignment is synchrounous
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    },500);
    
    return () => {
      messagesRef.off('value');
    };
  },[loadMessages]);

  const handleLike = useCallback(async (msgId) => {
    const messageRef = database.ref(`/messages/${msgId}`);
    let alertMsg;
    const {uid} = auth.currentUser;
    await messageRef.transaction(msg => {
      if(msg){
        if(msg.likes && msg.likes[uid]){
          msg.likes[uid] = null;
          msg.likeCount -= 1;
          alertMsg = 'Like Removed';
        }
        else{
          msg.likeCount += 1;
          if(!msg.likes){
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like Added';
        }
        
      }
      return msg;
    });
    Alert.info(alertMsg,4000);
  },[]);


  const renderMessage = () => {

    const groups = groupBy(messages,(item) => new Date(item.createdAt).toDateString());
    
    const items = [];
    Object.keys(groups).forEach((date) => {

      items.push(<li key={date} className='text-center mb-1 padded'>{date}</li>);

      const msgs = groups[date].map(msg => (
        <MessageItem key={msg.id}
          message={msg} handleAdmin={handleAdmin} 
          handleLike={handleLike} handleDelete={handleDelete}/>
      ));
      items.push(...msgs);
      });
      return items;
  }

  // messages.map(msg => <MessageItem key={msg.id}
  //   message={msg} handleAdmin={handleAdmin} 
  //   handleLike={handleLike} handleDelete={handleDelete}/>)


  return (
    <ul ref={selfRef} className='msg-list custom-scroll'>
      {messages && messages.length>=PAGE_SIZE && 
      <li className='text-center mt-2 mb-2'>
        <Button onClick={onLoadMore} color='green'>Load more</Button>
          </li>}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && 
      renderMessage()}
    </ul>
  )
}

export default memo(Messages);