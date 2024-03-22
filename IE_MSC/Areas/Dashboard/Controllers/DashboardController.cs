using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard/Dashboard
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult GetPcnWeekData() {
            try
            {
                object result = R_PCN.GetPcnWeekData();

                return Json(new {status = true, data = result}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPcnData()
        {
            try
            {
                object result = R_PCN.GetPcnData();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}