/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/function-component-definition */
import React,{useState} from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite'
import { useModalState } from '../../../misc/custom-hooks'
import { storage } from '../../../misc/firebase';


const MAX_FILE_SIZE = 1000*1024*5;

const AttachmentBtnModal = ({afterUpload}) => {
    const {isOpen,open,close} = useModalState();
    const [files,setFiles] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const {chatId} = useParams();


    const onChange = (fileArray) => {
        const filtered = fileArray.filter(file => file.blobFile.size<=MAX_FILE_SIZE).slice(0,5);
        setFiles(filtered);
    }

    const onSend = async () => {
        setIsLoading(true);
        try {
            const uploadPromises = files.map(file => {
                return storage.ref(`/chat/${chatId}`).child(Date.now()+file.name).put(file.blobFile,{
                    cacheControl: `public, max-age=${3600*24*5}`
                });
            });
            const uploadSnapShots = await Promise.all(uploadPromises);

            const downloadPromises = uploadSnapShots.map(async f => {
                return {
                    contentType: f.metadata.contentType,
                    name: f.metadata.name,
                    url: await f.ref.getDownloadURL()
                }
            });

            const filesurls = await Promise.all(downloadPromises);
            
            await afterUpload(filesurls);
            setIsLoading(false);
            close();

        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,4000);
        }
    }

  return (
    <>
        <InputGroup.Button onClick={open}>
            <Icon icon="attachment"/>
        </InputGroup.Button>
        <Modal show={isOpen} onHide={close}>
            <Modal.Header>
                <Modal.Title>
                    Send files to chat 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Uploader
             autoUpload={false}
             action=""
             onChange={onChange}
             fileList={files}
             className='w-100'
             multiple
             listType='picture-text'
             />
            </Modal.Body>
            <Modal.Footer>
                <Button block disabled={isLoading} onClick={onSend}>
                    Send to chat
                </Button>
                <div className='text-right mt-2'>
                    <small>*Only files less than 5MB are allowed</small>
                </div>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default AttachmentBtnModal