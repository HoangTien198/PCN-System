using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.IE.Controllers
{
    public class HomeController : BaseIEController
    {
        // GET: IE/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}