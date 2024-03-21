namespace IE_MSC.Models.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class DepartmentEmployee
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(36)]
        public string DepartmentID { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(36)]
        public string EmployeeID { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        [StringLength(36)]
        public string UpdatedBy { get; set; }

        [StringLength(36)]
        public string CreatedBy { get; set; }

        public virtual Department Department { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
