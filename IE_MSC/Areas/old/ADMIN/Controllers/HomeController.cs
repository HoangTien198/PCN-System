using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.ADMIN.Controllers
{
    public class HomeController : BaseADMINController
    {
        // GET: ADMIN/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}