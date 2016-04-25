import React from 'react';
import ReactDOM from 'react-dom';
import auth from './auth';

var Login = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
	},  
	getInitialState(){
		return {
			error: false
		};
	},
	handleSubmit(event){
		event.preventDefault();

		var username = ReactDOM.findDOMNode(this.refs.username).value;
		var	password = ReactDOM.findDOMNode(this.refs.password).value;

		auth.login(username, password, (loggedIn) => {
			if(!loggedIn)
				return this.setState({error: true});

			var {location} = this.props;

	      if (location.state && location.state.nextPathName) {
	        this.context.router.replace(location.state.nextPathName);
	      } else {
	        this.context.router.replace('/');
	      }		
  		});
	},
	render(){
		return(
			<div className="container">
			  <h1>Login</h1>
			  	{this.state.error && (
			  		<div className="alert alert-danger" role="alert">
					  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
					   <span className="sr-only">Error:</span>
					   <span>Wrong username or password. Please try again.</span>
					</div>
			  	)}
			  <form onSubmit={this.handleSubmit}>
			    <div className="form-group">
			      <label>Username</label>
			      <input ref="username" type="text" placeholder="Username" className="form-control"/>
			    </div>
			    <div className="form-group">
			      <label>Password</label>
			      <input ref="password" type="password" placeholder="Enter Password" className="form-control"/>
			    </div>
			    <input name="submit" type="submit" value="Login" className="btn btn-default"/>
			  </form>
			</div>
		);
	}
})

module.exports = Login;