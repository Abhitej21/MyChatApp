import React from 'react'
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import Bottom from '../../components/Chat-window/bottom';
import Messages from '../../components/Chat-window/messages';
import Top from '../../components/Chat-window/top';
import { CurrentRoomProvider } from '../../context/current-room.context';
import { useRooms } from '../../context/rooms.context';




function Chat() {

    const {chatId} = useParams();

    const rooms = useRooms();

    if(!rooms){
        return <Loader center vertical size="md" content="Loading" speed="slow"/>
    }

    const currentRoom = rooms.find(room => room.id === chatId);

    if(!currentRoom){
        return <h5 className='text-center mt-page'>Chat {chatId} not found</h5>
    }

    const {name,description} = currentRoom; 
    const currentRoomData = {
        name,description,
    };

    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className='chat-top'>
                <Top/>
            </div>
            <div className='chat-middle'>
                <Messages/>
            </div>
            <div className='chat-bottom'>
                <Bottom/>
            </div>
        </CurrentRoomProvider>
    )
}

export default Chat;