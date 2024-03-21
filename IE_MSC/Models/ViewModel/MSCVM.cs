//using IE_MSC.Models.Dao;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;

//namespace IE_MSC.Models.ViewModel
//{
//    public class MSCVM
//    {
//        public string MSCID { get; set; }
//        public string MSCCode { get; set; }
//        public string RecommendedBy { get; set; }
//        public DateTime? RecommendedDate { get; set; }
//        public string Subject { get; set; }
//        public string ProcessTitle { get; set; }
//        public string ModelTitle { get; set; }
//        public string BeforeChangeDescription { get; set; }
//        public string AfterChangeDescription { get; set; }
//        public string Reason { get; set; }
//        public string BeforeChangeFile { get; set; }
//        public string AfterChangeFile { get; set; }
//        public string CalculateCost { get; set; }
//        public DateTime? EffectiveDate { get; set; }
//        public int? Status { get; set; }
//        public string IEConfirmBy { get; set; }
//        public DateTime? IEConfirmDate { get; set; }
//        public string BossConfirmBy { get; set; }
//        public DateTime? BossConfirmDate { get; set; }
//        public string IERejectBy { get; set; }
//        public DateTime? IERejectDate { get; set; }
//        public string BossRejectBy { get; set; }
//        public DateTime? BossRejectDate { get; set; }
//        public string RejectReason { get; set; }
//        public DateTime? CreatedDate { get; set; }
//        public DateTime? UpdatedDate { get; set; }
//        public string UpdatedBy { get; set; }
//        public string CreatedBy { get; set; }
        
//        //Add thêm:
//        public List<DepartmentVM> Departments
//        {
//            get
//            {
//                try
//                {
//                    var deptDao = new DepartmentDao();
//                    return deptDao.GetAllDepartmentVM(MSCID);
//                }
//                catch (Exception)
//                {
//                    return null;
//                }
                
//            }
//        }
//        public string RecommendedByName
//        {
//            get
//            {
//                try
//                {
//                    var empDao = new EmployeeDao();
//                    return empDao.GetNameByID(RecommendedBy);
//                }
//                catch (Exception)
//                {
//                    return null;
//                }
//            }
//        }
//        public string DatetimeYYYYMMDD
//        {
//            get
//            {
//                var result = ((DateTime)RecommendedDate).ToString("yyyy-MM-dd hh:mm:ss");
//                return result;
//            }
//        }
//        public string RecommendedByDepartment {
//            get
//            {
//                var dao = new EmployeeDao();
//                var result = dao.GetDepartmentNameByID(RecommendedBy);
//                return result;
//            }
//        }

//        public List<DepartmentConfirmVM> StatusDepartmentConfirms
//        {
//            get
//            {
//                try
//                {
//                    List<DepartmentConfirmVM> lstTemp = new List<DepartmentConfirmVM>();
//                    foreach (var item in Departments)
//                    {
//                        var dao = new DepartmentConfirmDao();
//                        var result = dao.GetByPrimaryKey(MSCID, item.DepartmentID);
//                        lstTemp.Add(result);
//                    }
//                    return lstTemp;
//                }
//                catch (Exception)
//                {

//                    return null;
//                }
                
//            }
//        }
//    }
//}