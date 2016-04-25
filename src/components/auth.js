import request from 'superagent';

module.exports = {
  login(username, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true, localStorage.username)
      return
    }
    loginRequest(username, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        localStorage.username = res.username
        if (cb) cb(true)
        this.onChange(true, username)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getUsername(){
    return localStorage.username ? localStorage.username : false
  },

  getToken() {
    return localStorage.token
  },

  logout(cb) {
    delete localStorage.token
    delete localStorage.username
    if (cb) cb()
    this.onChange(false)
  },

  loggedIn() {
    return !!localStorage.token
  },

  onChange() {}
}

function loginRequest(username, password, cb) {
  	request
  		.post('/api/login')
  		.send({username: username, password: password})
  		.end(function(err, res){
  			if(err){
  				cb({authenticated: false});
  			}else{
  		    	cb({
        			authenticated: true,
        			token: res.body.token,
              username: res.body.username
      			});
  		    }
  		});
}
