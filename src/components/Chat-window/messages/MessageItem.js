/* eslint-disable no-console */
import React from 'react'
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import Presence from '../../Presence';
import ProfileAvatar from '../../ProfileAvatar';
import IconMsg from './IconMsg';
import ImgBtnModal from './ImgBtnModal';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';


const renderFileMsg = (file) => {
    if(file.contentType.includes('image')){
        return <div className='height-220'>
            <ImgBtnModal src={file.url} fileName={file.name}/>
        </div>
    }

    return <a href={file.url}>Download {file.name}</a>
}


function MessageItem({message,handleAdmin,handleLike,handleDelete}) {
    
    const {author,createdAt,text,file,likes,likeCount} = message;

    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const isMobile = useMediaQuery('(max-width: 992px)');
    const canGrantAdmin = isAdmin && !isAuthor;
    const [selfRef,isHovered] = useHover();
    const canShowHeart = isMobile || isHovered;
    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);



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
                <IconMsg 
                {...(isLiked)?{color: "red"}:{}}
                isVisible={canShowHeart}
                iconName="heart"
                tooltip="Like this message"
                onClick={() => handleLike(message.id)}
                badgeContent={likeCount}/>


                {isAuthor && 
                <IconMsg 
                isVisible={canShowHeart}
                iconName="close"
                tooltip="Delete this message"
                onClick={() => handleDelete(message.id)}
                />}


            </div>

            <div>
                <span className='word-breal-all'>
                    {text && <span className='word-breal-all'>{text}</span>}
                    {file && renderFileMsg(file)}
                </span>
            </div>
        </li>
    )
}

export default MessageItem;