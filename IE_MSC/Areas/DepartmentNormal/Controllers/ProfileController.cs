using IE_MSC.Commons;
using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.DepartmentNormal.Controllers
{
    public class ProfileController : BaseDepartmentController
    {
        // GET: DepartmentNormal/Profile
        public ActionResult Index()
        {
            return View();
        }

        public string GetProfileUser()
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new EmployeeDao();
            var result = dao.GetByID(userLogin.EmployeeID);
            var jsonReuslt = JsonSerializer.Serialize(result);
            return jsonReuslt;
        }

        public int ChangePassword(string currentPassword, string newPassword, string renewPassword)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new EmployeeDao();
            var result = dao.ChangePassword(currentPassword, newPassword, renewPassword, userLogin);
            return result;
        }
    }
}