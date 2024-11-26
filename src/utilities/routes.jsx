import AllDepartments from "../pages/AllDepartments";
import EmployeeModel from "../pages/Employee";
import Department from "../pages/Department";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export var apiOrigin = "http://localhost:8080/api/v1";

export var routes = [
    {
        path: "/",
        element: <Home />
    }, 
    {
        path: "/login",
        element: <Login />
    }, 
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/:employee_id",
        element: <EmployeeModel />
    },
    {
        path: "/departments",
        element: <AllDepartments />
    },
    {
        path: "/departments/:department_id",
        element: <Department />
    }
]

export var pathMap = {
    "/" : 'employees',
    "/departments": 'departments'
}