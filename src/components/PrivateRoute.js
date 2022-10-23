import React from 'react'
import { Redirect, Route } from 'react-router';

function PrivateRoute({children,...routeprops}) {
    const profile = false;
    if(!profile){
        return <Redirect to="/signin"/>
    }
    return (
        <Route {...routeprops}>
            {children}
        </Route>
    )
}

export default PrivateRoute