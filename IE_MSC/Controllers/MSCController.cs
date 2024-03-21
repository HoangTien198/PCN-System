using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Controllers
{
    public class MSCController : Controller
    {
        // GET: MSC
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX
        //public string GetAll()
        //{
        //    var dao = new MSCDao();
        //    var data = dao.GetAllMSCVM();
        //    return data;
        //}

        //public string GetAllForIE()
        //{
        //    var dao = new MSCDao();
        //    var data = dao.GetAllMSCVMForIE();
        //    return data;
        //}
        public string GetById(string pcnID)
        {
            var dao = new MSCDao();
            var result = dao.GetById(pcnID);
            var jsonResult = JsonSerializer.Serialize(result);
            return jsonResult;
        }

        public string GetByFilter(string type)
        {
            var dao = new MSCDao();
            var result = dao.GetByFilter(type);
            if (result != null)
            {
                var jsonResult = JsonSerializer.Serialize(result);
                return jsonResult;
            }
            else
            {
                return "";
            }
            
        }
        public string GetCreatedByDept(string type)
        {
            var dao = new MSCDao();
            var result = dao.GetCreatedByDept(type);
            if (result != null)
            {
                var jsonResult = JsonSerializer.Serialize(result);
                return jsonResult;
            }
            else
            {
                return "";
            }

        }
        #endregion
    }
}