using System;
using System.Web.Mvc;

namespace IE_MSC.Areas.Customer.Controllers
{
    public class ManagementController : Controller
    {
        // GET: Customer/Management

        /* GET */
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
    }
}