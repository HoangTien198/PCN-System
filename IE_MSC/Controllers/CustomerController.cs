using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX
        public string Get()
        {
            var dao = new CustomerDao();
            return dao.Get();
        }

        public string GetById(string customerID)
        {
            var dao = new CustomerDao();
            var result = dao.GetById(customerID);
            if (result != null)
            {
                var jsonString = JsonSerializer.Serialize(result);
                return jsonString;
            }
            else
            {
                return "";
            }
        }
        #endregion
    }
}