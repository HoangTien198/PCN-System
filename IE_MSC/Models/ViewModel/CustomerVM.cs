using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.ViewModel
{
    public class CustomerVM
    {
        public string CustomerID { get; set; }

        public string CustomerName { get; set; }
        public string Description { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string UpdatedBy { get; set; }

        public string CreatedBy { get; set; }
    }
}