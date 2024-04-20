using IE_MSC.Commons;
using IE_MSC.Models.Ajax;
using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;
using IE_MSC.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.DepartmentNormal.Controllers
{
    public class MSCController : BaseDepartmentController
    {
        // GET: DepartmentNormal/MSC
        public ActionResult Index()
        {
            return View();
        }

        public string GetMSCByAccount()
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var dao = new MSCDao();
            var check = dao.GetMSCByAccount(userLogin);
            return check;
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

        //public string GetMSCByStatus()
        //{
        //    AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
        //    var dao = new MSCDao();
        //    var result = dao.GetMSCByStatus(userLogin);
        //    return result;
        //}
    }
}