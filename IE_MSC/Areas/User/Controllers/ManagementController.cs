using IE_MSC.Areas.Dashboard.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.User.Controllers
{
    public class ManagementController : Controller
    {
        // GET: User/Management
        public JsonResult GetUser(string Id)
        {
            try
            {
                var result = R_User.GetUser(Id);
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "User does not exists." }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetUsers()
        {
            try
            {
                var result = R_User.GetUsers();
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "User does not exists." }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetSessionUser()
        {
            try
            {
                var result = R_User.GetSessionUser();
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return RedirectToAction("Index", "Authentication");
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetCustomerDepartments()
        {
            try
            {
                var result = R_User.GetCustomerDepartments();
                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetDepartments()
        {
            try
            {
                var result = R_User.GetDepartments();
                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}