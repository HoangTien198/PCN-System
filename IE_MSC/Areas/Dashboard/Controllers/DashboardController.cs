using IE_MSC.Areas.Attributes;
using System;
using System.Web.Mvc;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    [Authentication]
    public class DashboardController : Controller
    {
        // GET: Dashboard/Dashboard
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetHeaderData()
        {
            try
            {
                object result = R_Dashboard.GetHeaderData();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetWeekData()
        {
            try
            {
                object result = R_Dashboard.GetWeekData();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDataByCustomer()
        {
            try
            {
                object result = R_Dashboard.GetDataByCustomer();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetMonthOfYearData()
        {
            try
            {
                object result = R_Dashboard.GetMonthOfYearData();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetMonthOfYearDataByDepartment()
        {
            try
            {
                object result = R_Dashboard.GetMonthOfYearDataByDepartment();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTop10()
        {
            try
            {
                object result = R_Dashboard.GetTop10();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTop10Action()
        {
            try
            {
                object result = R_Dashboard.GetTop10Action();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}