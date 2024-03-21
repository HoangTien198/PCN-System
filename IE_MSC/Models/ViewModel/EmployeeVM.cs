using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.ViewModel
{
    public class EmployeeVM
    {
        public string EmployeeID { get; set; }

        public string EmployeeCode { get; set; }

        public string EmployeeCNName { get; set; }

        public string EmployeeVNName { get; set; }

        public string EmployeeAvatar { get; set; }

        public int? Gender { get; set; }
        public int? Position { get; set; }
        public DateTime? HireDate { get; set; }

        public string Email { get; set; }

        public string DeskPhone { get; set; }

        public string MobilePhone { get; set; }

        public string DepartmentID { get; set; }

        public string DepartmentByAPI { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string UpdatedBy { get; set; }

        public string CreatedBy { get; set; }

        public int? Status { get; set; }

        public bool? IsAdmin { get; set; }

        public bool? IsBoss { get; set; }

        //Add thêm:
        public List<DepartmentVM> LstDepartment
        {
            get
            {
                try
                {
                    var dao = new DepartmentDao();
                    var depEmp = dao.GetVMByEmployeeID(EmployeeID);
                    return depEmp;
                }
                catch (Exception)
                {

                    return null;
                }
                
                
            }
        }

        public string OwnerDepartmentName
        {
            get
            {
                try
                {
                    var dao = new EmployeeDao();
                    return dao.GetOwnerDepartmentById(EmployeeID);
                }
                catch (Exception)
                {

                    return "";
                }
                
            }
        }
    }
}