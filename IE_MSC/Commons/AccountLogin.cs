using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IE_MSC.Commons
{
    public class AccountLogin
    {
        public string EmployeeID { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeCNName { get; set; }
        public string EmployeeVNName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string EmployeeAvatar { get; set; }
        public string DepartmentID { get; set; }
        public int? Gender { get; set; }
        public int? Position { get; set; }
        public int ViewLogin { get; set; }
        public string DeptOwner
        {
            get
            {
                var dao = new EmployeeDao();
                var result = dao.GetOwnerDepartmentById(EmployeeID);
                return result;
            }
        }

    }
}