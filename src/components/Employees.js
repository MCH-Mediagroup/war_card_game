import Table from 'react-bootstrap/Table';

const Employees = ( {employees} ) => {
    return (
        <div>
        <h2>Employees Data...</h2>
        <Table striped bordered hover responsive>
        <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Location</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.location}</td>
              <td>{emp.salary}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      );
    
}

export default Employees;