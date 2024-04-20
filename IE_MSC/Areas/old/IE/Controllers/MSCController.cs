using IE_MSC.Commons;
using IE_MSC.Models.Ajax;
using IE_MSC.Models.Dao;
using IE_MSC.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.IE.Controllers
{
    public class MSCController : BaseIEController
    {
        // GET: IE/MSC
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX

        public string GetMSCByAccount()
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var data = dao.GetMSCByAccount(userLogin);
            return data;
        }

        [HttpPost]
        public string SaveMSCAfterCreate(AjaxMSC data)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.SaveMSCAfterCreate(data, userLogin);
            return check;
        }

        [HttpPost]
        public string SaveMSCAfterEdit(AjaxMSC data)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.SaveMSCAfterEdit(data, userLogin);
            return check;
        }

        [HttpPost]
        public int SaveMSCCaculateCost(string PCNID, string CalculateCost)
        {
            var dao = new MSCDao();
            var check = dao.SaveCalculateCostIE(PCNID, CalculateCost);
            return check;//1: ok, 0: error
        }

        [HttpPost]
        public int ConfirmMSC(string MSCID, string EmployeeID)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.ConfirmMSC(MSCID, EmployeeID, userLogin);
            return check;//1 OK, 0: ko dk kí, -1: Server Error, 2: Chưa đến lượt
        }

        [HttpPost]
        public int RejectMSC(PCNConfirmVM data)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.RejectMSC(data, userLogin);
            return check;
        }
        #endregion
    }
}