using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text.Json;

namespace IE_MSC.Controllers
{
    public class DepartmentController : Controller
    {
        // GET: Department
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX
        public string GetAllDepartment()
        {
            var dao = new DepartmentDao();
            var jsonResult = JsonSerializer.Serialize(dao.GetAllDepartmentVMByCustomer(""));
            return jsonResult;
        }

        public string GetByCustomerID(string customerID)
        {
            var dao = new DepartmentDao();
            var jsonResult = JsonSerializer.Serialize(dao.GetAllDepartmentVMByCustomer(customerID));
            return jsonResult;
        }

        public string GetByID(string departmentID)
        {
            var dao = new DepartmentDao();
            var jsonResult = JsonSerializer.Serialize(dao.GetByDepartmentID(departmentID));
            return jsonResult;
        }
        #endregion
    }
}