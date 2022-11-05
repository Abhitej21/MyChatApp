/* eslint-disable react/function-component-definition */
import React from 'react'
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';


const ConditionalBadge = ({condition,children}) => {
    return condition?<Badge content={condition}>{children}</Badge>:children;
};

function IconMsg({isVisible,tooltip,iconName,onClick,badgeContent,...props
}) {
    return (
        <div className='ml-2' style={{visibility: isVisible?'visible':'hidden'}}>

            <ConditionalBadge condition={badgeContent}>
                <Whisper placement="top" trigger="hover" speaker={
                     <Tooltip>{tooltip}</Tooltip>
                }>
                    <IconButton
                    {...props} onClick={onClick} circle size="xs" icon={<Icon icon={iconName}/>}/>
                </Whisper>
            </ConditionalBadge>

        </div>
    )
}

export default IconMsg;