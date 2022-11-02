/* eslint-disable react/function-component-definition */
import React,{memo} from 'react'
import { useCurrentRoom } from '../../../context/current-room.context';

const Messages = () => {

  const description = useCurrentRoom(v => v.description);
  return (
    <div>{description}</div>
  )
}

export default memo(Messages);