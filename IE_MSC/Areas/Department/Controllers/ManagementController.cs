using IE_MSC.Areas.Dashboard.Controllers;
using System;
using System.Web.Mvc;

namespace IE_MSC.Areas.Department.Controllers
{
    public class ManagementController : Controller
    {
        // GET: Department/Manager
        public ActionResult Manager()
        {
            return View();
        }

        /* GET */
        public ActionResult GetDepartments()
        {
            try
            {
                var result = R_Department.GetDepartments();
                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}