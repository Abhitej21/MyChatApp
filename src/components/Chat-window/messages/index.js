/* eslint-disable no-console */
/* eslint-disable react/function-component-definition */
import React,{memo, useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helper';
import MessageItem from './MessageItem';

const Messages = () => {

  const {chatId} = useParams();
  const [messages,setMessages] = useState(null);

  const isChatEmpty = messages && messages.length===0;
  const canShowMessages = messages && messages.length>0;


  const handleAdmin = useCallback(async (uid) => {
    const adminsRef = database.ref(`/rooms/${chatId}/admin`);
    console.log(adminsRef);
     console.log(uid);
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

  useEffect(() => {
    const messagesRef = database.ref('/messages');
    messagesRef.orderByChild('roomId').equalTo(chatId).on('value',snap => {
      const data = transformToArrWithId(snap.val());

      setMessages(data);
    });
    return () => {
      messagesRef.off('value');
    };
  },[chatId]);
  return (
    <ul className='msg-list custom-scroll'>
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id}
       message={msg} handleAdmin={handleAdmin}/>)}
    </ul>
  )
}

export default memo(Messages);