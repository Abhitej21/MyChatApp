import React,{useState,useCallback} from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';


function assembleMessage(profile,chatId){
    return {
        roomId: chatId,
        author: {
            name: profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar? {avatar: profile.avatar}:{})
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        likeCount: 0,
    };
}


function Bottom() {

    const [input,setInput] = useState('');

     const onInputChange = useCallback((value) => {
        setInput(value);
     },[]);

     const {profile} = useProfile();
     const {chatId} = useParams();
     const [isLoading,setIsLoading] = useState(false);
     const onSend = async () => {
        if(input.trim()===''){
            return;
        }
         const msgData = assembleMessage(profile,chatId);
         msgData.text = input;
         const updates = {

         };

         const messageId = database.ref('messages').push().key;
         updates[`/messages/${messageId}`] = msgData;
         updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            msgId: messageId,
         };
         setIsLoading(true);
         try {
            
            await database.ref().update(updates);
            setInput('');
            setIsLoading(false);
         } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,10000);
         }
     }
     const onKeyDown = (ev) => {
        if(ev.keyCode===13){
            ev.preventDefault();
            onSend();
        }
     }
    return (
        <div>
            <InputGroup>
            <AttachmentBtnModal/>
            <Input placeholder="Write a new message..." value={input}
             onChange={onInputChange}
             onKeyDown={onKeyDown}
             />
            <InputGroup.Button color='blue' 
            appearance='primary' 
            onClick={onSend}
            disabled={isLoading}>
              <Icon icon='send'/>  

            </InputGroup.Button>
            </InputGroup>
        </div>
    )
}

export default Bottom;