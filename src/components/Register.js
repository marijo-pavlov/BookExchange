import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';

var Register = React.createClass({
	getInitialState(){
		return {
			errors: [],
			success: [],
			hidden: true
		};
	},
	eachErrorDisplay(error, i){
		return (
				<div className="alert alert-danger" role="alert" key={i}>
				  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
				   <span className="sr-only">Error:</span>
				   <span>{error.msg}</span>
				</div>
			);
	},
	eachSuccessDisplay(success, i){
		return (
				<div className="alert alert-success" role="alert" key={i}>
				   <span>{success.msg}</span>
				</div>
			);
	},
	show(){
		return (<h1>Hello</h1>);
	},
	hide(){
		return (<h1>Hello</h1>);
	},
	handleForm(e){
		e.preventDefault();
		var self = this;

		var form = {
			email: ReactDOM.findDOMNode(this.refs.email).value,
			username: ReactDOM.findDOMNode(this.refs.username).value,
			password: ReactDOM.findDOMNode(this.refs.password).value,
			password2: ReactDOM.findDOMNode(this.refs.password2).value,
			submit: ReactDOM.findDOMNode(this.refs.submit).value
		}

		
		request
			.post('/api/register')
			.send(form)
			.end(function(err, res){
				if(err) throw err;
				if(res.body.success){
					var success = self.state.success;
					success.push({msg: 'You have successfully registrated. You may log in now.'});
					self.setState({
						errors: [],
						success: success
					});
					console.log(success);
				}else{
					self.setState({
						errors: res.body.errors,
						success: []
					});
				}
			});
	},
	render(){
		return(
			<div className="container">
			  <h1>Register</h1>
			  <ul className="errors">
			  	{this.state.errors.map(this.eachErrorDisplay)}
			  </ul>
			  <ul className="success">
			  	{this.state.success.map(this.eachSuccessDisplay)}
			  </ul>
			  <form onSubmit={this.handleForm}>
			    <div className="form-group">
			      <label>Username</label>
			      <input ref="username" type="text" placeholder="Username" className="form-control" required/>
			    </div>
			    <div className="form-group">
			      <label>Email</label>
			      <input ref="email" type="email" placeholder="Enter Email" className="form-control" required/>
			    </div>
			    <div className="form-group">
			      <label>Password</label>
			      <input ref="password" type="password" placeholder="Enter Password" className="form-control" required/>
			    </div>
			    <div className="form-group">
			      <label>Confirm Password</label>
			      <input ref="password2" type="password" placeholder="Confirm Password" className="form-control" required/>
			    </div>
			    <input ref="submit" type="submit" value="Register" className="btn btn-default"/>
			  </form>
			</div>
		);
	}
})

module.exports = Register;