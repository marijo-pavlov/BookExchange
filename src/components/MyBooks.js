import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import auth from './auth';

var MyBooks = React.createClass({
	getInitialState(){
		return{
			searching: false,
			searchBooks: [],
			myBooks: [],
			success: false
		}
	},
	componentDidMount(){
		var self = this;

		request
			.post('/api/getmybooks')
			.send({
				token: auth.getToken()
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						myBooks: res.body.myBooks
					})
				}
			})
	},
	searchBooks(event){
		event.preventDefault();

		var self = this;

		var query = ReactDOM.findDOMNode(this.refs.query).value;
		
		request
			.get('https://www.googleapis.com/books/v1/volumes?q=' + query)
			.end(function(err, res){
				if(err) throw err;

				if(res.status == 200){
					self.setState({
						searchBooks: res.body.items,
						searching: true,
						success: false
					});
				}
			});
	},
	addNewBook(book){
		var self = this;

		request
			.post('/api/newbook')
			.send({
				token: auth.getToken(),
				book: book
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						success: 'You have successfully added new book.',
						myBooks: res.body.myBooks,
						searchBooks: [],
						searching: false
					});
					document.getElementById('newBookForm').reset();
				}
			})
	},
	removeBook(book){
		var self = this;

		request
			.post('/api/removebook')
			.send({
				token: auth.getToken(),
				book: book
			})
			.end(function(err, res){
				if(err) throw err;

				if(res.body.success){
					self.setState({
						success: 'You have successfully removed the book.',
						myBooks: res.body.myBooks
					});
				}
			});
	},
	eachMyBook(book, i){
			return (
					<div className="col-sm-3 col-xs-4" key={i}>
						<div className="row">
							<div className="col-sm-12">
								<div className="overlayParent">
									<img src={book.imageLink} className="img-responsive img-thumbnail" />
									<div className="overlay">
										<span className="glyphicon glyphicon-remove book" aria-hidden="true" onClick={this.removeBook.bind(null, book)}></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					);
	},
	eachBook(book, i){
		if(book.volumeInfo.imageLinks){
			return (
					<div className="col-sm-3 col-xs-4" key={i}>
						<div className="row">
							<div className="col-sm-12">
								<div className="overlayParent">
									<img src={book.volumeInfo.imageLinks.thumbnail} className="img-responsive img-thumbnail"/>
									
									<div className="overlay">
											<span className="glyphicon glyphicon-plus book" aria-hidden="true" onClick={this.addNewBook.bind(null, book)}></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					);
		}else{
			return (
					<div className="col-sm-3 col-xs-4" key={i}>
						<div className="overlayParent">
							<img src="http://placehold.it/200x200" className="img-responsive img-thumbnail" onClick={this.addNewBook.bind(null, book)}/>

							<div className="overlay">
									<span className="glyphicon glyphicon-plus book" aria-hidden="true" onClick={this.addNewBook.bind(null, book)}></span>
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
			myBooks: this.array_chunk(this.state.myBooks, 4),
			searchBooks: this.array_chunk(this.state.searchBooks, 4)
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
					<div className="col-sm-12">
						<h4>My Books</h4>

						{(this.state.myBooks.length !== 0 ?
							<p>Click the <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> to remove a book.</p> : null
						)}

						{(this.state.myBooks.length === 0 ?
							<p className="alert alert-info">You currently do not have any book.</p> : null
						)}

						{	//http://stackoverflow.com/questions/36318601/react-js-every-nth-item-add-opening-tag-or-closing-tag
							rows.myBooks.map((row, i) => {
							return (
								<div className="row" key={i}>
									{row.map(this.eachMyBook)}
								</div>
							)
						})}				
					</div>
				</div>

				<div className="row">
					<div className="col-sm-12">
						<h4>Add new book</h4>
						<form onSubmit={this.searchBooks} id="newBookForm">
							<div className="form-group has-feedback">
							  <label>Book title</label>
							  <input ref="query" type="text" className="form-control" placeholder="Enter a book title"/>
							  <span className="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
							</div>
						</form>

						{(this.state.searchBooks.length !== 0 ?
							<p>Click the <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> to add a book.</p> : null
						)}
					</div>
				</div>

				{	//http://stackoverflow.com/questions/36318601/react-js-every-nth-item-add-opening-tag-or-closing-tag
					rows.searchBooks.map((row, i) => {
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

module.exports = MyBooks;