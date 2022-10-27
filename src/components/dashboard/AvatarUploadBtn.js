/* eslint-disable no-console */
/* eslint-disable no-unreachable */
/* eslint-disable react/function-component-definition */
import React, { useState,useRef } from 'react'
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useProfile } from '../../context/profile.context';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from '../ProfileAvatar';

const acceptFileTypes = '.png, .jpeg, .jpg';

const acceptedFiles = ['image/png','image/jpeg','image/jpg','image/pjpeg'];

const isValid = (file) => {
return acceptedFiles.includes(file.type);
}

const getBlob = (canvas) => {
    return new Promise((resolve,reject) => {
        canvas.toBlob((blob)=>{
            if(blob){
                resolve(blob);
            }
            else{
                reject(new Error('File Process Error'));
            }
        })
    })
}

const AvatarUploadBtn = () => {
    const {isOpen,open,close} = useModalState();
    const [img,setImg] = useState(null);
    const {profile} = useProfile();
    const avatarRef = useRef();
    const [isLoading,setIsLoading] = useState(false);
    const onFileInputChange = (ev) => {
            const currFiles = ev.target.files;
            if(currFiles.length === 1){
                const file = currFiles[0];
                if(isValid(file)){
                    console.log('valid file');
                    setImg(file);
                    open();
                }
                else{
                    Alert.warning(`Invalid file format ${file.type}`,4000);
                }
            }
    }
    const onUploadClick = async () => {
        const canvas = avatarRef.current.getImageScaledToCanvas();
        setIsLoading(true);
        try {
            const blob = await getBlob(canvas);
            const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');
            const uploadAvatarResult = await avatarFileRef.put(blob,{
                cacheControl: `public, max-age=${3600 * 24 * 3}`
            });
            const URL = await uploadAvatarResult.ref.getDownloadURL();
            const avatarURL = database.ref(`/profiles/${profile.uid}`).child('avatar');
            
            avatarURL.set(URL);
            setIsLoading(false);
            Alert.info("Avatar has been uploaded",4000);

        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,4000);
        }
    }   

  return (
    <div className='mt-3 text-center'>

        <ProfileAvatar name={profile.name} src={profile.avatar} className="width-200 height-200 img-fullsize font-huge"/>

        <div>
           <label htmlFor="avatar-upload" className='d-block cursor-pointer padded'>
            Select new avatar 
            <input id="avatar-upload" type='file' className='d-none' 
            accept={acceptFileTypes}
            onChange={onFileInputChange}/>
            </label> 

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        Adjust and upload new avatar 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex justify-content-center align-center'>{
                    img && 
                    <AvatarEditor
                    ref = {avatarRef}
                    image={img}
                    width={200}
                    height={200}
                    border={10}
                    borderRadius={100}
                    rotate={0}
                    />}
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance="ghost" 
                    onClick={onUploadClick}
                    disabled={isLoading}>
                        Upload new avatar 
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    </div>
  );
}

export default AvatarUploadBtn;