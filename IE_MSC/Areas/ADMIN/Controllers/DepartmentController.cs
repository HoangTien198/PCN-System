using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.ADMIN.Controllers
{
    public class DepartmentController : BaseADMINController
    {
        // GET: ADMIN/Department
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX
        public int SaveAfterCreate(string departmentName, string customerID)
        {
            var dao = new DepartmentDao();
            var check = dao.SaveAfterCreate(departmentName, customerID);
            return check;// 1: Success, 0: đã có, -1: Server Error
        }

        public int SaveAfterEdit(string departmentName, string customerID, string departmentID)
        {
            var dao = new DepartmentDao();
            var check = dao.SaveAfterEdit(departmentName, customerID, departmentID);
            return check;// 1: Success, 0: đã có, -1: Server Error
        }
        #endregion
    }
}