import React from 'react';
import request from 'superagent';
import auth from './auth';

var AllBooks = React.createClass({
	getInitialState(){
		return {
			books: [],
			myBooks: [],
			sentRequests: [],
			recivedRequests: [],
			success: false
		}
	},
	componentDidMount(){
		var self = this;

		request
			.post('/api/getbooksandrequests')
			.send({
				token: auth.getToken()
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						books: res.body.books,
						recivedRequests: res.body.recivedRequests,
						sentRequests: res.body.sentRequests,
						myBooks: res.body.myBooks
					})
				}
			});
	},
	proposeTrade(book){
		var self = this;

		request
			.post('/api/proposetrade')
			.send({
				token: auth.getToken(),
				book: book
			})
			.end(function(err, res){
				if(res.body.success){
					self.setState({
						success: 'You have successfully sent new book request.',
						sentRequests: res.body.sentRequests,
						recivedRequests: res.body.recivedRequests
					});
				}
			});
	},
	eachSentRequest(request, i){
		var found = this.state.books.find(function(element){
			return request.book === element._id;
		});

		
		if(found){			
			return (
				<div className="col-sm-3 col-xs-6" key={i}>
						<div className="row">
							<div className="col-sm-12">
								<div className="overlayParent">
									<img src={found.imageLink} className="img-responsive img-thumbnail"/>
									
									<div className="overlay">
											<span className="glyphicon glyphicon-remove request" aria-hidden="true" onClick={this.withdrawProposal.bind(null, request)}></span>
									</div>
								</div>
							</div>
						</div>
				</div>
			);	
		}

	},
	eachRecivedRequest(request, i){
		var found = this.state.books.find(function(element){
			return request.book === element._id;
		});

		
		if(found){			
			return (
				<div className="col-sm-3 col-xs-6" key={i}>
					<div className="row">
						<div className="col-sm-12">
							<div className="overlayParent">
								<img src={found.imageLink} className="img-responsive img-thumbnail"/>
						
								<div className="overlay">
										<span className="glyphicon glyphicon-ok request" aria-hidden="true" onClick={this.withdrawProposal.bind(null, request)}></span>
										<span className="glyphicon glyphicon-remove request2 pull-right" aria-hidden="true" onClick={this.withdrawProposal.bind(null, request)}></span>
								</div>
							</div>
						</div>
					</div>

				</div>
			);	
		}

	},
	acceptProposal(proposal){
		var self = this;

		request
			.post('/api/accepttrade')
			.send({
				token: auth.getToken(),
				request: proposal
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						success: 'You have accepted the proposal.',
						sentRequests: res.body.sentRequests,
						recivedRequests: res.body.recivedRequests
					});
				}
			});
	},
	rejectProposal(proposal){
		var self = this;

		request
			.post('/api/rejecttrade')
			.send({
				token: auth.getToken(),
				request: proposal
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						success: 'You have rejected the proposal.',
						sentRequests: res.body.sentRequests,
						recivedRequests: res.body.recivedRequests
					});
				}
			});
	},
	withdrawProposal(proposal){
		var self = this;

		request
			.post('/api/rejecttrade')
			.send({
				token: auth.getToken(),
				request: proposal
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						success: 'You have withdraw the proposal.',
						sentRequests: res.body.sentRequests,
						recivedRequests: res.body.recivedRequests
					});
				}
			});
	},
	eachBook(book, i){

		var found = this.state.myBooks.find(function(element){
			return book._id === element._id;
		});

		if(!found){

			found = this.state.sentRequests.find(function(element){
				return book._id === element.book;
			});

			if(!found){
				return (
							<div className="col-sm-3 col-xs-4" key={i}>
								<div className="row">
									<div className="col-xs-12">
										<div className="overlayParent">
											<img src={book.imageLink} className="img-responsive img-thumbnail"/>

											<div className="overlay">
												<span className="glyphicon glyphicon-repeat book" aria-hidden="true" onClick={this.proposeTrade.bind(null, book)}></span>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
			}

			return (
						<div className="col-sm-3 col-xs-4" key={i}>
							<div className="row">
								<div className="col-xs-12">
									<img src={book.imageLink} className="img-responsive img-thumbnail"/>
								</div>
							</div>
						</div>
					);

		}else{
			return (
					<div className="col-sm-3 col-xs-4" key={i}>
						<div className="row">
							<div className="col-xs-12">
								<img src={book.imageLink} className="img-responsive img-thumbnail"/>
							</div>
						</div>
					</div>
				);
		}
	},
	// http://stackoverflow.com/questions/36318601/react-js-every-nth-item-add-opening-tag-or-closing-tag
	array_chunk(arr, size) {
	  if (!Array.isArray(arr)) {
	    return [];
	  }

	  if (typeof size !== 'number') {
	    return [];
	  }

	  var result = [];
	  for (var i = 0; i < arr.length; i += size) {
	    result.push(arr.slice(i, size + i));
	  }

	  return result;
	},
	removeSuccess(){
		this.setState({
			success: false
		});
	},
	render(){
		var rows = {
			sentRequests: this.array_chunk(this.state.sentRequests, 6),
			recivedRequests: this.array_chunk(this.state.recivedRequests, 6),
			books: this.array_chunk(this.state.books, 4),
		};

		return(
			<div className="container">

				{this.state.success && (
					<div className="alert alert-success" role="alert">
				   		<span>{this.state.success}</span>
				   		<button type="button" className="close" aria-label="Close" onClick={this.removeSuccess}><span aria-hidden="true">&times;</span></button>
					</div>
				)}

				<div className="row">
					<div className="col-xs-6">
 						<h4>Requests you have sent</h4>

						{(this.state.sentRequests.length === 0 ?
							<p className="alert alert-info">You have not sent any request.</p> : null
						)}

						{(this.state.sentRequests.length !== 0 ?
							<p>Click the <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> to remove a request.</p> : null
						)}

						{	//http://stackoverflow.com/questions/36318601/react-js-every-nth-item-add-opening-tag-or-closing-tag
							rows.sentRequests.map((row, i) => {
							return (
								<div className="row" key={i}>
									{row.map(this.eachSentRequest)}
								</div>
							)
						})}
 					</div>
					<div className="col-xs-6">
 						<h4>Requests you have recived</h4>

						{(this.state.recivedRequests.length === 0 ?
							<p className="alert alert-info">You have not recived any request.</p> : null
						)}

						{(this.state.recivedRequests.length !== 0 ?
							<p>Click the <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> to accept or click the <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> to remove a request.</p> : null
						)}

						{	//http://stackoverflow.com/questions/36318601/react-js-every-nth-item-add-opening-tag-or-closing-tag
							rows.recivedRequests.map((row, i) => {
							return (
								<div className="row" key={i}>
									{row.map(this.eachRecivedRequest)}
								</div>
							)
						})}
					</div>
				</div>

				<h4>All books</h4>	
				{(this.state.books.length !== 0 ?
					<p>Click the <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span> to send a request.</p> : null
				)}

				{(this.state.books.length === 0 ?
					<p className="alert alert-info">There are currently no books.</p> : null
				)}

				{	//http://stackoverflow.com/questions/36318601/react-js-every-nth-item-add-opening-tag-or-closing-tag
					rows.books.map((row, i) => {
					return (
						<div className="row" key={i}>
							{row.map(this.eachBook)}
						</div>
					)
				})}
			</div>
		);
	}
})

module.exports = AllBooks;