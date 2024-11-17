const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

// Employee schema
const EmployeeSchema = new mongoose.Schema({
  unique_id: { type: String, required: true, unique: true },
  image: String,
  name: String,
  email: String,
  mobileNo: String,
  designation: String,
  gender: String,
  course: [String],
  createdAt: Date,
});

// Export models
module.exports = {
  User: mongoose.model('User', UserSchema, 'login'),
  Employee: mongoose.model('Employee', EmployeeSchema, 'employee'),
};
