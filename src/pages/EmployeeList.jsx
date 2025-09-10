import { useEffect, useState } from "react";
import {jwtDecode } from "jwt-decode";
import api from "../api";


function EmployeeList(){

    const[employees,setEmployees] =useState([]);
    const[role,setRole] = useState("USER");
    const [totalPages, setTotalPages] = useState(0);
    const[page, setPage] = useState(0);

    const fetchEmployees = async (pageNumber) => {
    try {
        console.log(localStorage.getItem("token"))
      const res = await api.get(`/employees?page=${pageNumber}&size=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEmployees(res.data.content); // adjust according to your backend response
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

    useEffect (() => {
        const token = localStorage.getItem("token");
        if(token){
            const decode = jwtDecode(token);
            setRole(decode.role || "USER");
        }

        fetchEmployees(page);
    },[page]);

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchEmployees(page);
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

    return(
    <div className="container mt-4">
      <h2 className="text-center mb-4">Employee List</h2>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Department</th>
            {role === "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.designation}</td>
              <td>{emp.salary}</td>
              <td>{emp.departmentId}</td>
              {role === "ADMIN" && (
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => alert("Navigate to Update Page")}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {[...Array(totalPages).keys()].map((num) => (
              <li
                key={num}
                className={`page-item ${page === num ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(num)}>
                  {num + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
    );
}

export default EmployeeList