using IE_MSC.Areas.Attributes;
using IE_MSC.Areas.Entities;
using System;
using System.Web.Mvc;
using static System.Net.Mime.MediaTypeNames;


namespace IE_MSC.Areas.PCN.Controllers
{
    [Authentication]
    public class ManagementController : Controller
    {
        // GET: PCN/Management
        public ActionResult Management()
        {
            return View();
        }

        public ActionResult CreateApplications()
        {
            return View();
        }
        public ActionResult MyApplications()
        {
            return View();
        }
        public ActionResult MySigns()
        {
            return View();
        }

        /* GET */
        [HttpGet]
        public JsonResult GetApplication(string IdApplication)
        {
            try
            {
                var result = R_PCN.GetApplication(IdApplication);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetApplications()
        {
            try
            {
                var result = R_PCN.GetApplications();

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
                var result = R_PCN.GetApplicationsServerSide(Request);

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult GetSessionUserApplicationsServerSide()
        {
            try
            {
                var result = R_PCN.GetSessionUserApplicationsServerSide(Request);

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult GetSessionUserSignApplicationsServerSide()
        {
            try
            {
                var result = R_PCN.GetSessionUserSignApplicationsServerSide(Request);

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }

        /* POST */
        [HttpPost]
        public JsonResult CreateApplication()
        {
            try
            {
                var result = R_PCN.CreateApplication(Request);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult UpdateApplication()
        {
            try
            {
                var result = R_PCN.UpdateApplication(Request);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult ApproveApplication(Entities.Sign sign, string calcCost)
        {
            try
            {
                var result = R_PCN.ApproveApplication(sign, calcCost);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult RejectApplication(Entities.Sign sign, string calcCost)
        {
            try
            {
                var result = R_PCN.RejectApplication(sign, calcCost);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /* DELETE */
        [HttpPost]
        public JsonResult DeleteApplication(string IdApplication)
        {
            try
            {
                var result = R_PCN.DeleteApplication(IdApplication);
                return Json(new { status = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /* HIDDEN */
        [Authentication(IsAdmin = true)]
        public JsonResult UpdateApplicationHidden()
        {
            try
            {
                var result = R_PCN.UpdateApplicationHidden();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult SendRemindEmail(string IdApplication)
        {
            try
            {
                var result = R_PCN.SendRemindEmail(IdApplication);              
                return Json(new { status = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}