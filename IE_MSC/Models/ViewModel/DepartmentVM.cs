using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.ViewModel
{
    public class DepartmentVM
    {
        public string DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public string CustomerID { get; set; }
        public int? Role { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        
        //add thêm
        public string CustomerName { get; set; }

    }
}