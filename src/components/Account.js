import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import auth from './auth';

var Account = React.createClass({
	getInitialState(){
		return{
			errors: [],
			success: false,
			user: {}
		};
	},
	componentDidMount(){
		var self = this;
		request
			.post('/api/getinfo')
			.send({
				token: auth.getToken()
			}).end(function(err, res){
				if(err) throw err;

				self.setState({
					user: res.body.user
				})
			});
	},
	handleSubmit(event){
		event.preventDefault();

		var self = this;

		var form = {
			token: auth.getToken(),
			oldpassword: ReactDOM.findDOMNode(this.refs.oldpassword).value,
			newpassword: ReactDOM.findDOMNode(this.refs.newpassword).value,
			newpassword2: ReactDOM.findDOMNode(this.refs.newpassword2).value
		};

		request
			.post('/api/changepassword')
			.send(form)
			.end(function(err, res){
				if(err) throw err;
				if(res.body.success){
					self.setState({
						success: 'You have successfully changed password.',
						errors: []
					});
					
					document.getElementById('passwordForm').reset();
				}else{
					self.setState({
						success: false,
						errors: res.body.errors
					})
				}
			});
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
	changeInfo(event){
		event.preventDefault();

		var self = this;

		var form = {
			token: auth.getToken(),
			name: ReactDOM.findDOMNode(this.refs.fullname).value,
			city: ReactDOM.findDOMNode(this.refs.city).value,
			state: ReactDOM.findDOMNode(this.refs.state).value
		};

		if(form.name || form.email || form.username){
			request
				.post('/api/changeinfo')
				.send(form)
				.end(function(err, res){
					if(err) throw err;
					if(res.body.success){
						self.setState({
							success: 'You have changed your info.',
							errors: [],
							user: res.body.user
						});

						document.getElementById('infoForm').reset();
					}else{
						self.setState({
							success: false,
							errors: res.body.errors
						})
					}
				});
		}else{
			var errors = [];
			errors.push({msg: 'You must fill at least one thing to change data.'});;
			this.setState({
				errors: errors,
				success: false
			})
		}
	},
	removeSuccess(){
		this.setState({
			success: false
		});
	},
	render(){
		return(
			<div className="container">
				<h3>Update profile</h3>

				<div className="errors">
			  		{this.state.errors.map(this.eachErrorDisplay)}
			  	</div>

				{this.state.success && (
					<div className="alert alert-success" role="alert">
				   		<span>{this.state.success}</span>
				   		<button type="button" className="close" aria-label="Close" onClick={this.removeSuccess}><span aria-hidden="true">&times;</span></button>
					</div>
				)}

					<form onSubmit={this.changeInfo} id="infoForm">
				    	<div className="form-group">
					      <label>Username</label>
					      <input type="text" placeholder={this.state.user.username} className="form-control" disabled/>
					    </div>
				    	<div className="form-group">
					      <label>Email</label>
					      <input type="text" placeholder={this.state.user.email} className="form-control" disabled/>
					    </div>
					    <div className="form-group">
					      <label>Full Name</label>
					      <input ref="fullname" type="text" placeholder={this.state.user.name} className="form-control"/>
					    </div>
				    	<div className="form-group">
					      <label>City</label>
					      <input ref="city" type="text" placeholder={this.state.user.city} className="form-control"/>
					    </div>
				    	<div className="form-group">
					      <label>State</label>
					      <input ref="state" type="text" placeholder={this.state.user.state} className="form-control"/>
					    </div>
					    <input name="submit" type="submit" value="Change Info" className="btn btn-info"/>
				  </form>

					<h3>Change Password</h3>

					<form onSubmit={this.handleSubmit} id="passwordForm">
				    	<div className="form-group">
					      <label>Old Password</label>
					      <input ref="oldpassword" type="password" className="form-control" required/>
					    </div>
				    	<div className="form-group">
					      <label>New Password</label>
					      <input ref="newpassword" type="password" className="form-control" required/>
					    </div>
				    	<div className="form-group">
					      <label>Repeat New Password</label>
					      <input ref="newpassword2" type="password" className="form-control" required/>
					    </div>
					    <input name="submit" type="submit" value="Change Password" className="btn btn-info"/>
				  </form>
			</div>
		);
	}
})

module.exports = Account;