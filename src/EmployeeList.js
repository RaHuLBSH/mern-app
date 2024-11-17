import React, { useEffect, useState } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'unique_id', direction: 'asc' });
  const navigate = useNavigate();


  const deleteEmployee = (unique_id) => {
    fetch(`http://localhost:5000/api/delete_employees/${unique_id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }
        setEmployees((prev) => prev.filter((emp) => emp.unique_id !== unique_id));
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
      });
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setEmployees(data.data);
        } else {
          setError('Failed to fetch employee data');
        }
      })
      .catch((error) => {
        setError('Error fetching data: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.mobileNo.includes(query) ||
      employee.designation.toLowerCase().includes(query) ||
      employee.gender.toLowerCase().includes(query) ||
      employee.course.some((course) => course.toLowerCase().includes(query)) || // Assuming course is an array
      employee.unique_id.toLowerCase().includes(query)
    );
  });

  // Sorting function
  const sortEmployees = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };

  // Paginate data
  const sortedEmployees = sortEmployees(filteredEmployees);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Header />
      <h4>
        Total Count: {filteredEmployees.length} <a href='/employee'>Create Employee</a>
      </h4>
      <br />
      <h4>
        Search{' '}
        <input
          type="text"
          placeholder="Enter Search Keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </h4>
      <br />
      <h1>Employee List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <center>
          <table style={{ border: '1px solid black' }} cellSpacing="10" cellPadding="5">
            <thead>
              <tr>
                <th onClick={() => handleSort('unique_id')} style={{ cursor: 'pointer' }}>
                  Unique Id {sortConfig.key === 'unique_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Image</th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                  Create Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee.unique_id}>
                    <td>{employee.unique_id}</td>
                    <td>
                      {employee.image ? (
                        <img
                          src={`http://localhost:5000/${employee.image}`}
                          alt={employee.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.mobileNo}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.course.join(', ')}</td>
                    <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => navigate(`/employee`, { state: { action: 'edit', employee } })}>
                        Edit
                      </button>
                      <button onClick={() => deleteEmployee(employee.unique_id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No employees available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
              Next
            </button>
          </div>
        </center>
      )}
    </div>
  );
}

export default EmployeeList;
