using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.Boss.Controllers
{
    public class HomeController : BaseBossController
    {
        // GET: Boss/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}