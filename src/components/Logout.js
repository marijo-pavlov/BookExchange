import React from 'react';
import auth from './auth';

var Logout = React.createClass({
	componentDidMount(){
		auth.logout();
	},
	render(){
		return(
			<div className="container">
				<h2>You are now logged out. Thank you for using BookExchange.</h2>
			</div>
		);
	}
})

module.exports = Logout;