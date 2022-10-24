/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react'
import { Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { useModalState } from '../../misc/custom-hooks';

function DashboardToggle() {
    
    const {isOpen,open,close} = useModalState();
    return (
        <>
        <Button block color='blue' onClick={open}>
            <Icon icon='dashboard'/> Dashboard
        </Button>
        <Drawer show={isOpen} onHide={close} placement="left">
            <Dashboard/>
        </Drawer>
        </>
    );
}

export default DashboardToggle;