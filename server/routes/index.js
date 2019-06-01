var express = require('express');
var router = express.Router();
const User = require('../models/User');
const UserSession = require('../models/UserSession');
const Todo = require('../models/Todo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/api/account/signin', (req, res, next) => {
  const {
    body
  } = req;
  const {
    password
  } = body;

  let {
    email
  } = body;

  if (!email) {
    res.send({
      succes: false,
      message: ' Error: Email cannot be blank.'
    })
  };
  if (!password) {
    res.send({
      succes: false,
      message: 'Error: Password cannot be blank.'
    })
  };
  email = email.toLowerCase();

  User.find({
    email: email
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: server error'
      });
    }
    if (users.length != 1) {
      return res.send({
        success: false,
        message: 'Error: invalid'
      })
    }

    const user = users[0];
    if (!user.validPassword(password)) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      })
    }

    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession.save((err, doc) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }

      Todo.find({
        user: user._id
      }, (err, todos) => {
        res.send({
          success: true,
          message: 'valid signin',
          token: doc._id,
          user: email,
          todos: todos
        })
      })
    })
  })
})

router.get('/api/account/logout', (req, res, next) => {

  //get the token
  //verify token that its unique
  // and that its not deleted
  const {
    query
  } = req;
  const {
    token
  } = query;

  UserSession.findOneAndUpdate({
    _id: token,
    isDeleted: false
  }, {
    $set: {
      isDeleted: true
    }
  }, null, (err, sessions) => {

    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: 'error: server error'
      });
    }

    return res.send({
      success: true,
      message: 'good'
    })
  })
})

router.post('/api/account/signup', (req, res, next) => {
  const {
    body
  } = req;

  const {
    firstName,
    lastName,
    password
  } = body;

  let {
    email
  } = body;


  if (!firstName) {
    res.send({
      succes: false,
      message: 'Error: First name cannot be blank.'
    })
  };

  if (!lastName) {
    res.send({
      succes: false,
      message: 'Error: Last name cannot be blank.'
    })
  };

  if (!password) {
    res.send({
      succes: false,
      message: 'Error: Password cannot be blank.'
    })
  };

  if (!email) {
    res.send({
      succes: false,
      message: ' Error: Email cannot be blank.'
    })
  };

  email = email.toLowerCase();

  //steps:
  //verify email doesnt exist
  //save

  User.find({
    email: email
  }, (err, previousUsers) => {
    if (err) {
      res.send({
        success: false,
        message: 'Error: Server Error'
      })
    }
    if (previousUsers.length > 0) {
      res.send({
        success: false,
        message: 'Error: Account already exists'
      })
    } else {
      //save new user

      const newUser = new User();

      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password)
      newUser.save((err, user) => {
        if (err) {
          res.send({
            success: false,
            message: 'Error: server error'
          })
        }
        res.send({
          success: true,
          message: 'Signed up'
        })
      })
    }
  })
})

router.get('/api/account/verify', (req, res, next) => {
  //get the token
  //verify token that its unique
  // and that its not deleted
  const {
    query
  } = req;
  const {
    token
  } = query;

  UserSession.find({
    userId: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      return res.send({
        success: false,
        message: 'error: server error'
      });
    }

    if (sessions.length < 1) {
      return res.send({
        success: false,
        message: 'error: Invalid'
      })
    } else {
      return res.send({
        success: true,
        message: 'good',
        sessions: sessions
      })
    }
  })
})





router.get('/todo', (req, res, next) => {
  const {
    query
  } = req;
  const {
    token
  } = query;
  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    Todo.find({
      user: sessions[0].userId
    }, (err, todos) => {
      res.send({
        success: true,
        message: 'todos found',
        todos: todos
      })
    })
  })
})

router.post('/todo', (req, res, next) => {
  const {
    body
  } = req;

  const {
    name,
    token,
  } = body;

  if (!name) {
    res.send({
      succes: false,
      message: 'Error: Name is required.'
    })
  } else {
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {

      const newTodo = new Todo();

      newTodo.name = name;
      newTodo.user = sessions[0].userId
      newTodo.save((err, todo) => {
        if (err) {
          console.log(err);
        } else {
          Todo.find({
            user: sessions[0].userId
          }, (err, todos) => {
            res.send({
              success: true,
              message: 'Group added',
              todos: todos
            })
          })

        }
      })
    })
  }
})

router.delete('/todo', function(req, res) {
  const {
    query
  } = req;
  const {
    todoId,
    token
  } = query;

  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: 'error: server error'
      });
    }

    if (sessions.length < 1) {
      return res.send({
        success: false,
        message: 'error: Invalid'
      })
    } else {
      Todo.deleteOne({
        _id: todoId
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          res.send({
            success: true,
            message: 'Todo deleted'
          })
        }
      })
    }
  })
})



module.exports = router;
