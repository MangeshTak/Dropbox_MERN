import React from 'react';
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import Login from '../component/login';
import Landing from '../component/landing';
import Home from '../component/home';
import Files from '../component/files';
import Groups from '../component/groups';

export default function() {
	return (<BrowserRouter>
		<Switch>
			<Route path="/" exact render={props => <Landing {...props}/>}/>
			<Route path="/login" exact render={props => <Login {...props} />}/>
			<Route path="/home" exact render={props => <Home {...props} />}/>
			<Route path="/files" exact render={props => <Files {...props} />}/>
			<Route path="/groups" exact render={props => <Groups {...props} />}/>
		</Switch>
	</BrowserRouter>);
}