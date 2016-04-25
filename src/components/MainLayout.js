import React from 'react';
import {Link} from 'react-router';
import auth from './auth';

var MainLayout = React.createClass({
	getInitialState(){
		return  {
			loggedIn: auth.loggedIn(),
			username: auth.getUsername()
		}
	},
	updateAuth(loggedIn, username = false){
		this.setState({
			loggedIn: loggedIn,
			username: username
		});
	},
	componentWillMount(){
		auth.onChange = this.updateAuth;
		auth.login();
	},
	render(){
		return(
			<div className="wrapper">
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container">
				    	<div className="navbar-header">
				      		<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
				        		<span className="sr-only">Toggle navigation</span>
				        		<span className="icon-bar"></span>
				        		<span className="icon-bar"></span>
				       			 <span className="icon-bar"></span>
				      		</button>
				      		<Link className="navbar-brand" to="/">BookExchange</Link>
				    	</div>

						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					 		<ul className="nav navbar-nav">
								<li><Link to="/">Home</Link></li>
							</ul>
								{this.state.loggedIn ? (
									<ul className="nav navbar-nav navbar-right">
										<li><Link to="/allbooks">All Books</Link></li>
										<li><Link to="/mybooks">My Books</Link></li>
										<li><Link to="/account"><span className="glyphicon glyphicon-user" aria-hidden="true"></span></Link></li>
										<li><Link to="/logout"><span className="glyphicon glyphicon-off" aria-hidden="true"></span></Link></li>
									</ul>
								) : (
									<ul className="nav navbar-nav navbar-right">
										<li><Link to="/register">Register</Link></li>
										<li><Link to="/login">Login</Link></li>
									</ul>
								)}
					    </div>
				  	</div>
				</nav>

				{this.props.children}
			</div>
		);
	}
})

module.exports = MainLayout;