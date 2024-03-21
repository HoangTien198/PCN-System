namespace IE_MSC.Models.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class PCN
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PCN()
        {
            PCNConfirms = new HashSet<PCNConfirm>();
        }

        [StringLength(36)]
        public string PCNID { get; set; }

        [StringLength(50)]
        public string PCNCode { get; set; }

        [StringLength(36)]
        public string RecommendedBy { get; set; }

        public DateTime? RecommendedDate { get; set; }

        [StringLength(250)]
        public string Subject { get; set; }

        [StringLength(250)]
        public string ProcessTitle { get; set; }

        [Column(TypeName = "ntext")]
        public string BeforeChangeDescription { get; set; }

        public string BeforeChangeFile { get; set; }

        [StringLength(250)]
        public string ModelTitle { get; set; }

        [Column(TypeName = "ntext")]
        public string AfterChangeDescription { get; set; }

        public string AfterChangeFile { get; set; }

        [Column(TypeName = "ntext")]
        public string Reason { get; set; }

        [Column(TypeName = "ntext")]
        public string CalculateCost { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public int? Status { get; set; }

        [StringLength(36)]
        public string IEConfirmBy { get; set; }

        public DateTime? IEConfirmDate { get; set; }

        [StringLength(36)]
        public string BossConfirmBy { get; set; }

        public DateTime? BossConfirmDate { get; set; }

        [StringLength(36)]
        public string IERejectBy { get; set; }

        public DateTime? IERejectDate { get; set; }

        [Column(TypeName = "ntext")]
        public string RejectReason { get; set; }

        [StringLength(36)]
        public string BossRejectBy { get; set; }

        public DateTime? BossRejectDate { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        [StringLength(36)]
        public string UpdatedBy { get; set; }

        [StringLength(36)]
        public string CreatedBy { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PCNConfirm> PCNConfirms { get; set; }
    }
}
