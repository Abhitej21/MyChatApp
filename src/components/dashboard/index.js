/* eslint-disable no-console */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/function-component-definition */
import React  from 'react'
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({onSignOut}) => {
  const {profile} = useProfile();
 const onSave = async newdata => {
    const userNicknameRef = database.ref(`/profiles/${profile.uid}`).child(`name`);
    try {
      await userNicknameRef.set(newdata);
      Alert.success('Nickname has been updated',4000);
    } catch (error) {
      Alert.error(error.message,4000);
    }
 }
 
  return (
  <>
    <Drawer.Header>
      <Drawer.Title>
        Dashboard
      </Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>
      <h3>Hey, {profile.name}</h3>
      <ProviderBlock/>
      <Divider/>
      <EditableInput
        initialValue = {profile.name}
        onSave = {onSave}
        label = {<h6 className="mb-2">NickName</h6>}
        name = "nickname"
      />
    </Drawer.Body>
    <Drawer.Footer>
    <Button block color="red" onClick={onSignOut}>Sign Out</Button>
    </Drawer.Footer>
  </>
  );
};

export default Dashboard;