const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const { User, Employee } = require('./models');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


// Login API route
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName, password });
    if (user) {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid login details' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Get employee data
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Add employee
router.post('/add_employees', upload.single('image'), async (req, res) => {
  const { name, email, mobileNo, designation, gender, course } = req.body;
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  let unique_id;
  do {
    unique_id = crypto.randomInt(100000, 999999).toString();
  } while (await Employee.findOne({ unique_id }));
  const createdAt = new Date();
  const newEmployee = new Employee({
    unique_id,
    name,
    email,
    mobileNo,
    designation,
    gender,
    course,
    createdAt,
    image: req.file.path,
  });
  try {
    await newEmployee.save();
    res.status(201).json({ success: true, message: 'Employee added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding employee' });
  }
});


// Edit employee
router.put('/edit_employees/:unique_id', upload.single('image'), async (req, res) => {
  const { unique_id } = req.params;
  const { name, email, mobileNo, designation, gender, course } = req.body;
  const image = req.file ? req.file.path : undefined;

  try {
    const employee = await Employee.findOne({ unique_id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (mobileNo) employee.mobileNo = mobileNo;
    if (designation) employee.designation = designation;
    if (gender) employee.gender = gender;
    if (course) employee.course = Array.isArray(course) ? course : [course];
    if (image) employee.image = image;
    await employee.save();
    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Delete employee
router.delete('/delete_employees/:unique_id', async (req, res) => {
  const { unique_id } = req.params;
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ unique_id });
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
