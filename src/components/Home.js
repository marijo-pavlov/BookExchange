import React from 'react';

var Home = React.createClass({
	render(){
		return(
			<div className="jumbotron homebg">
				<div className="container">
				  <h1>Hello to BookExchange!</h1>
				  <p>BookExchange is a service for exchanging books.</p>
			  	</div>
			</div>
		);
	}
})

module.exports = Home;