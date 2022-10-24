/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/function-component-definition */
import React  from 'react'
import { Button, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';

const Dashboard = ({onSignOut}) => {
  const {profile} = useProfile();
   return (
  <>
    <Drawer.Header>
      <Drawer.Title>
        Dashboard
      </Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>
      <h3>Hey, {profile.name}</h3>
    </Drawer.Body>
    <Drawer.Footer>
    <Button block color="red" onClick={onSignOut}>Sign Out</Button>
    </Drawer.Footer>
  </>
  );
};

export default Dashboard;