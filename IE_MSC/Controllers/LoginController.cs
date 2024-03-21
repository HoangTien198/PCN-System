using IE_MSC.Commons;
using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JavaScriptResult CheckLogin(string username, string password)
        {
            if (!string.IsNullOrEmpty(username) || !string.IsNullOrEmpty(password))
            {
                //đã có username và password
                LoginDao loginDao = new LoginDao();
                int checkLogin = loginDao.checkLogin(username, password);
                if (checkLogin == -1)// Login fail
                {
                    return JavaScript("endload();Swal.fire(\"Login Fail!\", \"Check again username and password!\", \"error\");");
                }
                else
                {
                    if (checkLogin == 0)//Admin
                    {
                        var userDao = new EmployeeDao();
                        var employee = userDao.GetByAccount(username, password);
                        //Gán Session:
                        var employeeSession = new AccountLogin();
                        employeeSession.EmployeeID = employee.EmployeeID;
                        employeeSession.EmployeeCode = employee.EmployeeCode;
                        employeeSession.EmployeeCNName = employee.EmployeeCNName;
                        employeeSession.EmployeeVNName = employee.EmployeeVNName;
                        employeeSession.EmployeeAvatar = employee.EmployeeAvatar;
                        employeeSession.Gender = employee.Gender;
                        employeeSession.Position = 0;
                        employeeSession.ViewLogin = 0;
                        //employeeSession.DepartmentType = employee.Department.Type;
                        Session.Add(CommonConstant.USER_SESSION, employeeSession);

                        return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/ADMIN/Home/Index';");
                    }
                    else
                    if (checkLogin == 1)//Boss
                    {
                        var userDao = new EmployeeDao();
                        var employee = userDao.GetByAccount(username, password);
                        //Gán Session:
                        var employeeSession = new AccountLogin();
                        employeeSession.EmployeeID = employee.EmployeeID;
                        employeeSession.EmployeeCode = employee.EmployeeCode;
                        employeeSession.EmployeeCNName = employee.EmployeeCNName;
                        employeeSession.EmployeeVNName = employee.EmployeeVNName;
                        employeeSession.EmployeeAvatar = employee.EmployeeAvatar;
                        employeeSession.Gender = employee.Gender;
                        employeeSession.Position = 1; //boss;
                        employeeSession.ViewLogin = 1; //boss;

                        Session.Add(CommonConstant.USER_SESSION, employeeSession);

                        return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Boss/Home/Index';");
                    }
                    else
                    if (checkLogin == 2)//IE
                    {
                        var userDao = new EmployeeDao();
                        var employee = userDao.GetByAccount(username, password);
                        var employeeSession = new AccountLogin();
                        employeeSession.EmployeeID = employee.EmployeeID;
                        employeeSession.EmployeeCode = employee.EmployeeCode;
                        employeeSession.EmployeeCNName = employee.EmployeeCNName;
                        employeeSession.EmployeeVNName = employee.EmployeeVNName;
                        employeeSession.EmployeeAvatar = employee.EmployeeAvatar;
                        employeeSession.Gender = employee.Gender;
                        employeeSession.Position = employee.Position;
                        employeeSession.ViewLogin = 2;// IE

                        Session.Add(CommonConstant.USER_SESSION, employeeSession);

                        return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/IE/Home/Index';");

                    }
                    else
                    if (checkLogin == 3)//Department Normal
                    {
                        var userDao = new EmployeeDao();
                        var employee = userDao.GetByAccount(username, password);
                        var employeeSession = new AccountLogin();
                        employeeSession.EmployeeID = employee.EmployeeID;
                        employeeSession.EmployeeCode = employee.EmployeeCode;
                        employeeSession.EmployeeCNName = employee.EmployeeCNName;
                        employeeSession.EmployeeVNName = employee.EmployeeVNName;
                        employeeSession.EmployeeAvatar = employee.EmployeeAvatar;
                        employeeSession.Gender = employee.Gender;
                        employeeSession.Position = employee.Position;
                        employeeSession.ViewLogin = 3;// Dept Normal
                        Session.Add(CommonConstant.USER_SESSION, employeeSession);

                        return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/DepartmentNormal/Home/Index';");
                    }
                }
                
                return JavaScript("window.location = '/ErrorPage/Error404/Index'");
            }
            else
            {
                //validate empty username, password
                return JavaScript("window.location = '/Home/Index'");
            }

        }

        /// <summary>
        /// Hàm logout
        /// </summary>
        /// <returns>View</returns>
        public ActionResult Logout()
        {
            Session[CommonConstant.USER_SESSION] = null;
            return RedirectToAction("Index", "Home");
        }
    }
}