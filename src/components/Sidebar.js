import React, { useEffect, useRef, useState } from 'react'
import { Divider } from 'rsuite';
import CreateRoomBtnModal from './dashboard/CreateRoomBtnModal';
import DashboardToggle from './dashboard/DashboardToggle'
import ChatRoomList from './rooms/ChatRoomList';

function Sidebar() {

    const topSidebarRef = useRef();
    const [height,setHeight] = useState(0);

    useEffect(() => {
        if(topSidebarRef.current){
            setHeight(topSidebarRef.current.scrollHeight);
        }
    },[topSidebarRef]);
    
    return (
        <div className="h-100 pt-2">
            <div>

                <DashboardToggle/>
                <CreateRoomBtnModal/>
                <Divider>Chat Conversation</Divider>
            </div>
            <ChatRoomList aboveHeight={height}/>
        </div>
    );
}

export default Sidebar;