const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'New Todo',
    required: true
  },
  user: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Todo', TodoSchema);
