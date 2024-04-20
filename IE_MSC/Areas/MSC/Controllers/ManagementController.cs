using IE_MSC.Areas.Dashboard.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.MSC.Controllers
{
    public class ManagementController : Controller
    {
        // GET: MSC/Management
        public ActionResult Management()
        {
            return View();
        }

        /* GET */
        public JsonResult GetApplication(string IdApplication)
        {
            try
            {
                var result = R_MSC.GetApplication(IdApplication);

                return Json(new {status = true, data = result}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new {status = false, message = ex.Message}, JsonRequestBehavior.AllowGet);
            }
        }

        /* POST */
    }
}