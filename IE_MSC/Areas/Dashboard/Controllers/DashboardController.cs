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
        public JsonResult GetPcnWeekData() {
            try
            {
                object result = R_Dashboard.GetPcnWeekData();

                return Json(new {status = true, data = result}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        
        public JsonResult GetPcnDataByCustomer()
        {
            try
            {
                object result = R_Dashboard.GetPcnDataByCustomer();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPcnMonthOfYearData()
        {
            try
            {
                object result = R_Dashboard.GetPcnMonthOfYearData();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetPcnMonthOfYearDataByDepartment()
        {
            try
            {
                object result = R_Dashboard.GetPcnMonthOfYearDataByDepartment();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetTop10Pcn()
        {
            try
            {
                object result = R_Dashboard.GetTop10Pcn();

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