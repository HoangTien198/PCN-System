//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IE_MSC.Areas.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Department_
    {
        public string DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public string CustomerID { get; set; }
        public Nullable<bool> IsIE { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
    
        public virtual Customer_ Customer { get; set; }
    }
}
