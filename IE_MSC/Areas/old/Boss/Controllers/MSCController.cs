using IE_MSC.Commons;
using IE_MSC.Models.Dao;
using IE_MSC.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.Boss.Controllers
{
    public class MSCController : BaseBossController
    {
        // GET: Boss/MSC
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX

        public string GetMSCByAccount()
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.GetMSCByBoss(userLogin);
            return check;
        }

        //public string GetMSCByStatus()
        //{
        //    AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
        //    var dao = new MSCDao();
        //    var data = dao.GetMSCByStatusByBoss(userLogin);
        //    return data;
        //}

        [HttpPost]
        public int ConfirmMSC(string MSCID, string EmployeeID)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.ConfirmMSC(MSCID, EmployeeID, userLogin);
            return check;//1 OK, 0: ko dk kí, -1: Server Error
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