using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using war_API.Models;

namespace war_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        [HttpGet("getall")]
        public List<Employee> GetAll()
        {
            List<Employee> empList = new List<Employee>
            {
                new Employee{Id=101,Name="Abhinav",Location="Bangalore",Salary=12345},

                new Employee{Id=102,Name="Abhishek",Location="Chennai",Salary=23456},

                new Employee{Id=103,Name="Akshay",Location="Bangalore",Salary=34567},

                new Employee{Id=104,Name="Akash",Location="Chennai",Salary=45678},

                new Employee{Id=105,Name="Anil",Location="Bangalore",Salary=56789}
            };
            return empList;
        }
    }
}
