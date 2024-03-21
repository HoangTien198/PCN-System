using IE_MSC.Commons;
using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.ADMIN.Controllers
{
    public class PCNController : BaseADMINController
    {
        // GET: ADMIN/PCN
        public ActionResult Index()
        {
            return View();
        }

        public string Get()
        {
            var dao = new MSCDao();
            var check = dao.Get();
            return check;
        }
        public int Delete(string pcnId)
        {
            var dao = new MSCDao();
            var check = dao.Delete(pcnId);
            return check;
        }
    }
}