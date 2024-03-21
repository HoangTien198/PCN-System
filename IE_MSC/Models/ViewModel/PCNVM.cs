using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;

namespace IE_MSC.Models.ViewModel
{

    public class PCNVM
    {
        public string PCNID { get; set; }
        public string PCNCode { get; set; }
        public string RecommendedBy { get; set; }
        public DateTime? RecommendedDate { get; set; }
        public string Subject { get; set; }
        public string ProcessTitle { get; set; }
        public string BeforeChangeDescription { get; set; }
        public string BeforeChangeFile { get; set; }
        public string ModelTitle { get; set; }
        public string AfterChangeDescription { get; set; }
        public string AfterChangeFile { get; set; }
        public string Reason { get; set; }
        public string CalculateCost { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public int? Status { get; set; }
        public string IEConfirmBy { get; set; }
        public DateTime? IEConfirmDate { get; set; }
        public string BossConfirmBy { get; set; }
        public DateTime? BossConfirmDate { get; set; }
        public string IERejectBy { get; set; }
        public DateTime? IERejectDate { get; set; }
        public string RejectReason { get; set; }
        public string BossRejectBy { get; set; }
        public DateTime? BossRejectDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }

        // add thêm:
        public string DeptNameCreated
        {
            get
            {
                try
                {
                    var dao = new EmployeeDao();
                    var lstOwner = dao.GetOwnerDepartmentById(CreatedBy);
                    return lstOwner;
                }
                catch (Exception)
                {

                    return null;
                }
            }
        }

        public string RecommendedByName
        {
            get
            {
                var dao = new EmployeeDao();
                return dao.GetNameByID(RecommendedBy);
            }
        }

        public string DatetimeYYYYMMDD
        {
            get
            {
                try
                {
                    var temp = ((DateTime)CreatedDate).ToString("yyyy-MM-dd");
                    return temp;
                }
                catch (Exception)
                {

                    return "";
                }
            }
        }

        public List<OwnerStatus> LstOwnerStatus
        {
            get
            {
                try
                {
                    var dao = new EmployeeDao();
                    var result = dao.GetOwnerStatus(PCNID);
                    return result;
                }
                catch (Exception)
                {
                    return null;
                }
                
            }
        }
    }
}