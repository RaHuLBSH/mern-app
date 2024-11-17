import React, { useState } from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';

function Employee() {
  const location = useLocation();
  const { action, employee } = location.state || {};
  const isEdit = action === 'edit';

  const [formData, setFormData] = useState({
    name: isEdit ? employee.name : '',
    email: isEdit ? employee.email : '',
    mobileNo: isEdit ? employee.mobileNo : '',
    designation: isEdit ? employee.designation : '',
    gender: isEdit ? employee.gender : '',
    course: isEdit ? employee.course : [],
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        course: checked
          ? [...prevState.course, value]
          : prevState.course.filter((course) => course !== value),
      }));
    } else if (type === 'file') {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.mobileNo || !mobileRegex.test(formData.mobileNo))
      newErrors.mobileNo = 'Valid 10-digit mobile number is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.image) {
      newErrors.image = 'Image is required';
    } else {
      const validExtensions = ['image/jpeg', 'image/png'];
      if (!validExtensions.includes(formData.image.type)) {
        newErrors.image = 'Only JPG or PNG images are allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) {
      return; 
    }
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'course') {
        formData.course.forEach((course) => formDataToSend.append('course', course));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    let response;
    try {
      if (isEdit) {
        response = await fetch(`http://localhost:5000/api/edit_employees/${employee.unique_id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch('http://localhost:5000/api/add_employees', {
          method: 'POST',
          body: formDataToSend,
        });
      }
  
      const result = await response.json();
      if (result.success) {
        alert(`Employee ${isEdit ? 'edited' : 'added'} successfully.`);
        window.location.href = '/employee-list';
      } else {
        alert(result.message || 'Operation failed.');
      }
    } catch (error) {
      alert(`Error ${isEdit ? 'editing' : 'adding'} employee: ${error.message}`);
    }
  };
  

  return (
    <div style={{ marginTop: '50px' }}>
      <Header />
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{marginLeft:'40%'}}>
      Name: <input type="text" name="name" value={formData.name} onChange={handleChange} />
      {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>} <br/><br/>
      Email: <input type="email" name="email" value={formData.email} onChange={handleChange} />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} <br/><br/>
      Mobile No: <input type="number" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
      {errors.mobileNo && <p style={{ color: 'red' }}>{errors.mobileNo}</p>} <br/><br/>
      Designation: 
      <select name="designation" value={formData.designation} onChange={handleChange}>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </select>
      {errors.designation && <p style={{ color: 'red' }}>{errors.designation}</p>} <br/><br/>
      Gender:
      <label>
        <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male
      </label>
      <label>
        <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female
      </label>
      {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>} <br/><br/>
      Course:
      <label>
        <input type="checkbox" name="course" value="MCA" checked={formData.course.includes('MCA')} onChange={handleChange} /> MCA
      </label>
      <label>
        <input type="checkbox" name="course" value="BCA" checked={formData.course.includes('BCA')} onChange={handleChange} /> BCA
      </label>
      <label>
        <input type="checkbox" name="course" value="BSC" checked={formData.course.includes('BSC')} onChange={handleChange} /> BSC
      </label><br/><br/>
      Image Upload: 
      <input type="file" name="image" onChange={handleChange} />
      {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}<br/><br/>
      <button type="submit">{isEdit ? 'Update Employee' : 'Create Employee'}</button>
    </form>
    </div>
  );
}

export default Employee;
