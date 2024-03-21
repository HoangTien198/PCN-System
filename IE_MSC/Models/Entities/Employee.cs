namespace IE_MSC.Models.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Employee
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Employee()
        {
            DepartmentEmployees = new HashSet<DepartmentEmployee>();
            PCNConfirms = new HashSet<PCNConfirm>();
        }

        [StringLength(36)]
        public string EmployeeID { get; set; }

        [StringLength(50)]
        public string EmployeeCode { get; set; }

        [StringLength(50)]
        public string EmployeeCNName { get; set; }

        [StringLength(50)]
        public string EmployeeVNName { get; set; }

        [StringLength(255)]
        public string EmployeeAvatar { get; set; }

        public int? Gender { get; set; }

        public DateTime? HireDate { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(50)]
        public string DeskPhone { get; set; }

        [StringLength(50)]
        public string MobilePhone { get; set; }

        [Column(TypeName = "ntext")]
        public string DepartmentByAPI { get; set; }

        [StringLength(50)]
        public string Username { get; set; }

        [StringLength(50)]
        public string Password { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        [StringLength(36)]
        public string UpdatedBy { get; set; }

        [StringLength(36)]
        public string CreatedBy { get; set; }

        public int? Status { get; set; }

        public bool? IsAdmin { get; set; }

        public bool? IsBoss { get; set; }

        public int? Position { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DepartmentEmployee> DepartmentEmployees { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PCNConfirm> PCNConfirms { get; set; }
    }
}
