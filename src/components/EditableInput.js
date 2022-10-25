/* eslint-disable react/function-component-definition */
import React, { useCallback, useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'

const EditableInput = ({initialValue,onSave,label=null,placeholder="Enter your nickname",empty="Input is Empty",...inputProps}) => {
 
   const [input,setInput] = useState(initialValue);
   const [isEditable,setIsEditable] = useState(false);

   const onInputChange =  useCallback((current) => {
        setInput(current);
   },[]);
 
   const onEditClick = useCallback(() => {
        setIsEditable(p => !p);
        setInput(initialValue);
   },[initialValue]);


     const onSaveClick = async () => {
          const trimmed = input.trim();
          if(trimmed===''){
               Alert.info(empty,4000);
          }
          if(trimmed!==initialValue){
               await onSave(trimmed);
          }
          setIsEditable(p => !p);
     }

    return (
    <div>
        {label}
        <InputGroup>
        <Input 
        {...inputProps} 
        disabled={!isEditable}
        value={input} 
        placeholder={placeholder} 
        onChange={onInputChange}/>
    <InputGroup.Button onClick={onEditClick}>
    <Icon icon={isEditable?'close':'edit2'}/>

    </InputGroup.Button>
    {isEditable && 
    <InputGroup.Button onClick={onSaveClick}>
     <Icon icon = "check"/>
    </InputGroup.Button>
    }
    </InputGroup>
    </div>
  )
}

export default EditableInput;