using IE_MSC.Models.Dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.ADMIN.Controllers
{
    public class CustomerController : BaseADMINController
    {
        // GET: ADMIN/Customer
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX

        public int SaveAfterCreate(string customerName, string customerDescription)
        {
            var dao = new CustomerDao();
            var check = dao.SaveAfterCreate(customerName, customerDescription);
            return check;//1: Sucess, -1: Server Error, 0: đã tồn tại
        }

        public int SaveAfterEdit(string customerID, string customerName, string customerDescription)
        {
            var dao = new CustomerDao();
            var check = dao.SaveAfterEdit(customerID, customerName, customerDescription);
            return check;//1: Sucess, -1: Server Error, 0: đã tồn tại
        }

        public int Delete(string customerID)
        {
            var dao = new CustomerDao();
            var check = dao.Delete(customerID);
            return check;// 1: success, -1: server error
        }
        #endregion
    }
}