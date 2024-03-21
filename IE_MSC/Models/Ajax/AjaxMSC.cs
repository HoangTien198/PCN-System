using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Net;
using System.Text.Encodings.Web;
using System.Web.UI.HtmlControls;
using System.Web.UI;

namespace IE_MSC.Models.Ajax
{
    public class Quill
    {
        public string properties { get; set; }
        //public int properties { get; set; }
    }


    public class Root
    {
        public List<EmployeeConfirm> LstOwnerSelected { get; set; }
    }
    public class EmployeeConfirm
    {
        public string EmployeeID { get; set; }
        public int SortOrder { get; set; }
    }
    public class AjaxMSC
    {
        public string PCNID { get; set; }
        //public string MSCCode { get; set; }
        //public string RecommendedBy { get; set; }
        //public DateTime? RecommendedDate { get; set; }
        public string Subject { get; set; }
        public string ProcessTitle { get; set; }
        public string ModelTitle { get; set; }
        public string BeforeChangeDescription { get; set; }
        public string AfterChangeDescription { get; set; }
        public string Reason { get; set; }
        public string LstOwnerSelected { get; set; }
        public HttpPostedFileBase BeforeChangeFile { get; set; }
        public HttpPostedFileBase AfterChangeFile { get; set; }
        public string CalculateCost { get; set; }

        //Add thêm:
        public bool SendToBoss { get; set; }
        
        //public DateTime? EffectiveDate { get; set; }
        //public int? Status { get; set; }
        //public string IEConfirmBy { get; set; }
        //public DateTime? IEConfirmDate { get; set; }
        //public string BossConfirmBy { get; set; }
        //public DateTime? BossConfirmDate { get; set; }
        //public string IERejectBy { get; set; }
        //public DateTime? IERejectDate { get; set; }
        //public string IERejectReason { get; set; }
        //public string BossRejectBy { get; set; }
        //public DateTime? BossRejectDate { get; set; }
        //public string BossRejectReason { get; set; }
        //public DateTime? CreatedDate { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        //public string UpdatedBy { get; set; }
        //public string CreatedBy { get; set; }
    }
}