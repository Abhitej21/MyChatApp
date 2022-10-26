import React from 'react'
import { Avatar } from 'rsuite'
import { getName } from '../misc/helper';

function ProfileAvatar({name,...avatarProps}) {
    return (
        <Avatar circle {...avatarProps}>
            {getName(name)} 
        </Avatar>
    )
}

export default ProfileAvatar;