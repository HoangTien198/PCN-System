using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.Ajax
{
    public class AjaxEmployee
    {
        public string EmployeeID { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeCNName { get; set; }
        public string EmployeeVNName { get; set; }
        public string EmployeeAvatar { get; set; }
        public int? Gender { get; set; }
        public string DepartmentAPI { get; set; }
        public string HireDate { get; set; }
        public string Email { get; set; }
        public string DeskPhone { get; set; }
        public string MobilePhone { get; set; }
        public int? Position { get; set; }
        public string CustomerID { get; set; }
        public string DepartmentID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }

        public int? RoleID { get; set; }

        public int? Status { get; set; }


    }
}