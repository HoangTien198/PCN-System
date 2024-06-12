using System;
using System.Web.Mvc;
using IE_MSC.Areas.Attributes;

namespace IE_MSC.Areas.Customer.Controllers
{
    [Authentication]
    public class ManagementController : Controller
    {
        // GET: Customer/Management
        [Authentication(IsAdmin = true)]
        public ActionResult Management()
        {
            return View();
        }


        /* GET */
        public JsonResult GetCustomer(string IdCustomer)
        {
            try
            {
                var result = R_Customer.GetCustomer(IdCustomer);
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
        public JsonResult GetCustomers()
        {
            try
            {
                var result = R_Customer.GetCustomers();
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
        public JsonResult CreateCustomer(Entities.Customer customer)
        {
            try
            {
                var result = R_Customer.CreateCustomer(customer);
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
        public JsonResult UpdateCustomer(Entities.Customer customer)
        {
            try
            {
                var result = R_Customer.UpdateCustomer(customer);
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
        public JsonResult DeleteCustomer(string IdCustomer)
        {
            try
            {
                var result = R_Customer.DeleteCustomer(IdCustomer);
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