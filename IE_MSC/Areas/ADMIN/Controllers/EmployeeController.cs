using IE_MSC.Models.Ajax;
using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.ADMIN.Controllers
{
    public class EmployeeController : BaseADMINController
    {
        // GET: ADMIN/Employee
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX
        public int SaveEmployeeAfterCreate(AjaxEmployee data)
        {
            var dao = new EmployeeDao();
            var check = dao.SaveEmployeeAfterCreate(data);
            return check;
        }

        public int SaveEmployeeAfterEdit(AjaxEmployee data)
        {
            var dao = new EmployeeDao();
            var check = dao.SaveEmployeeAfterEdit(data);
            return check;
        }

        public int AppointToDepartment(string employeeID, string departmentID)
        {
            var dao = new DepartmentEmployeeDao();
            var check = dao.AppointToDepartment(employeeID, departmentID);
            return check;// 1: ok, 0: đã tồn tại, -1: Server error
        }
        #endregion
    }
}