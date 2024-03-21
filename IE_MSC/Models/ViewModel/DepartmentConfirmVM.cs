//using IE_MSC.Models.Entities;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations.Schema;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Web;
//using IE_MSC.Models.Dao;

//namespace IE_MSC.Models.ViewModel
//{
//    public class DepartmentConfirmVM
//    {
//        public string DepartmentID { get; set; }
//        public string MSCID { get; set; }

//        public int? Status { get; set; }

//        public string ConfirmedBy { get; set; }

//        public DateTime? ConfirmedDate { get; set; }

//        public string RejectedBy { get; set; }

//        public DateTime? RejectedDate { get; set; }
//        public string ReasonReject { get; set; }
//        //thêm
//        public string DepartmentName { get; set; }
//        public string ConfirmedByName
//        {
//            get
//            {
//                try
//                {
//                    var dao = new EmployeeDao();
//                    return dao.GetNameByID(ConfirmedBy);
//                }
//                catch (Exception)
//                {
//                    return string.Empty;
//                }
                
//            }
//        }
//        public string RejectedByName
//        {
//            get
//            {
//                try
//                {
//                    var dao = new EmployeeDao();
//                    return dao.GetNameByID(RejectedBy);
//                }
//                catch (Exception)
//                {
//                    return string.Empty;
//                }

//            }
//        }
//        public string Type
//        {
//            get
//            {
//                var dao = new DepartmentDao();
//                var deptVM = dao.GetByDepartmentID(DepartmentID);
//                return deptVM.Type;
//            }
//        }
//    }
//}