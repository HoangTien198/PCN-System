using IE_MSC.Commons;
using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.DepartmentNormal.Controllers
{
    public class HomeController : BaseDepartmentController
    {
        // GET: DepartmentNormal/Home
        public ActionResult Index()
        {
            return View();
        }

    }
}