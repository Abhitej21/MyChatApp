/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable spaced-comment */
import React, { useCallback, useRef, useState } from 'react'
import firebase from 'firebase'
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite'
import { useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';


const {StringType} = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired('Chat name Required'),
    description: StringType().isRequired('Description Required'),
})

const SAMPLE_FORM = {
    name: '',
    description: ''
}

function CreateRoomBtnModal() {
    const {isOpen,open,close} = useModalState();
    const [isLoading,setIsLoading] = useState(false);
    const [form,setForm] = useState(SAMPLE_FORM);
    const formRef = useRef();
    const openNewRoom = () => {
            open();
    }

    const onFormChange = useCallback((value) => {
        setForm(value);
    },[]);
    
    const onSubmit = async () => {
        if(!formRef.current.check()){
            return;
        }
        setIsLoading(true);
        const newRoomData = {
            ...form,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            admin: {
                [auth.currentUser.uid] : true,
            }
        }
        try {
          await  database.ref('rooms').push(newRoomData);
          setIsLoading(false);
          setForm(SAMPLE_FORM);
          close();
          Alert.info(`${form.name} has been created`,4000);

        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,4000);
        }
    }
    return (

        


        <div className='mt-2'>
            <Button block color='green' onClick={openNewRoom}>
                <Icon icon="creative" /> Create New Room 
            </Button>

        <Modal show={isOpen} onHide={close}>
            <Modal.Header>
                <Modal.Title>
                    New Chat Room 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid onChange={onFormChange} 
                formValue={form} 
                ref = {formRef}
                model={model}>
                    <FormGroup>
                        <ControlLabel>
                            Room Name 
                        </ControlLabel>
                        <FormControl name="name" placeholder="Enter room name..."/>
                    </FormGroup>


                <FormGroup>
                <ControlLabel>
                            Description 
                    </ControlLabel>
                    <FormControl componentClass="textarea"
                     name="description" rows={5} 
                     placeholder="Enter description..."/>
                </FormGroup>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button block appearance='primary' disabled={isLoading} onClick={onSubmit}>
                    Create New Chat Room 
                </Button>
            </Modal.Footer>
        </Modal>



        </div>
    )
}

export default CreateRoomBtnModal