/* eslint-disable no-console */
import React from 'react'
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import Presence from '../../Presence';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

function MessageItem({message,handleAdmin}) {
    
    const {author,createdAt,text} = message;

    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;

    const canGrantAdmin = isAdmin && !isAuthor;
    const [selfRef,isHovered] = useHover();
    return (
        <li className={`padded mb-1 ${isHovered ? 'bg-black-02':''}`} ref={selfRef}>
            <div className='d-flex align-items-center font-bolder mb-1'>
                
                <Presence uid={author.uid}/>
                <ProfileAvatar src={author.avatar} name={author.name} className="ml-1" size="xs"/>
                <ProfileInfoBtnModal profile={author}>
                    {canGrantAdmin && 
                    <Button block onClick={() => handleAdmin(author.uid)} color='blue' >
                        {isMsgAuthorAdmin ? 'Remove admin permission':'Give admin permission'}
                    </Button>}
                </ProfileInfoBtnModal>
                <TimeAgo datetime={createdAt} className="font-normal text-black-45 ml-2"/>

            </div>

            <div>
                <span className='word-breal-all'>{text}</span>
            </div>
        </li>
    )
}

export default MessageItem