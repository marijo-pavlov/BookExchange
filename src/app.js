import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, browserHistory} from 'react-router';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import AllBooks from './components/AllBooks';
import MyBooks from './components/MyBooks';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Account from './components/Account';
import auth from './components/auth';

function requireAuth(nextState, replace){
	if(!auth.loggedIn()){
		replace({
			pathname: '/login',
			state: {
				nextPathName: nextState.location.pathname
			}
		})
	}
}

render(
	<Router history={browserHistory}>
		<Route component={MainLayout}>
			<Route path="/" component={Home} />
			<Route path="/login" component={Login} />
			<Route path="/register" component={Register} />
			<Route path="/allbooks" component={AllBooks} onEnter={requireAuth}/>
			<Route path="/mybooks" component={MyBooks} onEnter={requireAuth}/>
			<Route path="/account" component={Account} onEnter={requireAuth}/>
			<Route path="/logout" component={Logout} />
		</Route>
	</Router>, 
	document.getElementById('react-container')
);