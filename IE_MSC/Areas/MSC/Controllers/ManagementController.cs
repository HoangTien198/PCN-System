using IE_MSC.Areas.Dashboard.Controllers;
using IE_MSC.Areas.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Results;
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
        [HttpGet]
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
        [HttpGet]
        public JsonResult GetApplications()
        {
            try
            {
                var result = R_MSC.GetApplications();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult GetApplicationsServerSide()
        {
            try
            {
                var result = R_MSC.GetApplicationsServerSide(Request);

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new {status = false, message = ex.Message});
            }
        }

        /* POST */
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult CreateApplication()
        {
            try
            {
                var result = R_MSC.CreateApplication(Request);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /* DELETE */
        [HttpDelete]
        public JsonResult DeleteApplication(string IdApplication)
        {
            try
            {
                var result = R_MSC.DeleteApplication(IdApplication);
                return Json(new { status = true}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}