using System;
using System.Web.Mvc;
using IE_MSC.Areas.Attributes;

namespace IE_MSC.Areas.Department.Controllers
{
    [Authentication]
    public class ManagementController : Controller
    {
        // GET: Department/Manager

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
        public JsonResult GetDepartment(string IdDepartment)
        {
            try
            {
                var result = R_Department.GetDepartment(IdDepartment);
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "Server Error!" }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /* POST */
        public JsonResult CreateDepartment(Entities.Department department)
        {
            try
            {
                var result = R_Department.CreateDepartment(department);
                if (result != null)
                {
                    return Json(new { status = true, data = result });
                }
                else
                {
                    return Json(new { status = false, message = "Server Error!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        public JsonResult UpdateDepartment(Entities.Department department)
        {
            try
            {
                var result = R_Department.UpdateDepartment(department);
                if (result != null)
                {
                    return Json(new { status = true, data = result });
                }
                else
                {
                    return Json(new { status = false, message = "Server Error!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        public JsonResult DeleteDepartment(string IdDepartment)
        {
            try
            {
                var result = R_Department.DeleteDepartment(IdDepartment);
                if (result != null)
                {
                    return Json(new { status = true, data = result });
                }
                else
                {
                    return Json(new { status = false, message = "Server Error!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
    }
}