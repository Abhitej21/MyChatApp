/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav } from 'rsuite'
import { useRooms } from '../../context/rooms.context';
import RoomItem from './RoomItem';

function ChatRoomList({aboveHeight}) {

    const rooms  = useRooms();
    const location = useLocation();

    return (
        <Nav appearance='subtle' vertical 
        reversed
        className='overflow-y-scroll custom-scroll'
        style={{
            height: `calc(100% - ${aboveHeight}px)`
        }}
        activeKey={location.pathname}>
            {!rooms && <Loader center vertical content="loading" speed="slow" size="md"/>}
                
            {rooms && rooms.length>0 && rooms.map(room => {
                return (<React.Fragment key={room.id}>
                <Nav.Item componentClass={Link} 
                to={`/chat/${room.id}`} 
                key={room.id}
                eventKey={`/chat/${room.id}`}> 
                <RoomItem room={room}/>
            </Nav.Item></React.Fragment>);
})}
                
                
        </Nav>
    )
}

export default ChatRoomList;