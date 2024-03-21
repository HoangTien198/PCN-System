namespace IE_MSC.Models.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class PCNConfirm
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(36)]
        public string EmployeeID { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(36)]
        public string PCNID { get; set; }

        public int? SortOrder { get; set; }

        public int? Status { get; set; }

        [StringLength(36)]
        public string ConfirmedBy { get; set; }

        public DateTime? ConfirmedDate { get; set; }

        [StringLength(36)]
        public string RejectedBy { get; set; }

        public DateTime? RejectedDate { get; set; }

        [Column(TypeName = "ntext")]
        public string ReasonReject { get; set; }

        public virtual Employee Employee { get; set; }

        public virtual PCN PCN { get; set; }
    }
}
