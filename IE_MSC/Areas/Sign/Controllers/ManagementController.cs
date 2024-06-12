using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace IE_MSC.Areas.Sign.Controllers
{
    public class ManagementController : Controller
    {
        // GET: Sign/Management
        public ActionResult DirectSign(string code)
        {
            try
            {
                if (string.IsNullOrEmpty(code)) return RedirectToAction("Index", "Authentication", new { area = "" });

                // Decode
                code = Common.StringToBase64Decode(code);
                var datas = code.Split(',');

                // Application
                var application = R_PCN.GetApplication(datas[0]);

                // Login 
                var user = R_User.GetUser(datas[1]);
                Session["UserSession"] = user;


                if (user != null)
                {
                    ViewBag.IdApplication = application.Id;
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Authentication", new { area = "" });
                }
            }
            catch (Exception)
            {
                return RedirectToAction("Index", "Authentication", new { area = "" });
            }
           
        }
    }
}