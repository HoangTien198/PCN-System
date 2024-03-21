using IE_MSC.Commons;
using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.IE.Controllers
{
    public class ProfileController : BaseIEController
    {
        // GET: IE/Profile
        public ActionResult Index()
        {
            return View();
        }
        public string GetProfileUser()
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new EmployeeDao();
            var result = dao.GetByID(userLogin.EmployeeID);
            var jsonResult = JsonSerializer.Serialize(result);
            return jsonResult;
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