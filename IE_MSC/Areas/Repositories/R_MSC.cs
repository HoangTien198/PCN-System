using IE_MSC.Areas.Entities;
using System;
using System.Data.Entity;
using System.Linq;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_MSC
    {
        // GET
        public static object GetApplication(string IdApplication)
        {
            try
            {
                using(var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var pcn = context.PCN_Set.Select(p => new
                    {
                        Id = p.PCNID.ToUpper(),

                        UserCreated = context.Employee_Set.FirstOrDefault(u => u.EmployeeID.ToUpper() == p.RecommendedBy.ToUpper()),
                        Departments = context.Employee_Set.FirstOrDefault(u => u.EmployeeID.ToUpper() == p.RecommendedBy.ToUpper()).DepartmentEmployees.Select(d => d.Department).ToList(),
                        DateCreated = p.RecommendedDate,
                        ApplicationStatus = (p.Status == 1) ? "Pending" : (p.Status == -1) ? "Rejected" : "Approved",
                        CodeMSC = p.PCNCode,
                        Title = p.Subject,
                        Process = p.ProcessTitle,
                        Model = p.ModelTitle,

                        BeforeChange = p.BeforeChangeDescription,
                        AfterChange = p.AfterChangeDescription,
                        BeforeChangeFile = p.BeforeChangeFile,
                        AfterChangeFile = p.AfterChangeFile,

                        Reason = p.Reason,
                        Cost = p.CalculateCost,

                        Signs = p.PCNConfirms.OrderBy(pc => pc.SortOrder).Select(pc => new
                        {
                            User = context.Employee_Set.FirstOrDefault(u => u.EmployeeID.ToUpper() == pc.EmployeeID.ToUpper()),
                            Departments = context.Employee_Set.FirstOrDefault(u => u.EmployeeID.ToUpper() == pc.EmployeeID.ToUpper()).DepartmentEmployees.Select(de => de.Department).ToList(),
                            DateSigned = (pc.ConfirmedBy != null) ? pc.ConfirmedDate : (pc.RejectedDate != null) ? pc.RejectedDate : null,
                            Status = (pc.ConfirmedBy != null) ? "Approved" : (pc.RejectedDate != null) ? "Rejected" :  "Pending",
                            Details = (pc.RejectedBy != null) ? pc.ReasonReject : null,
                            Order = pc.SortOrder,
                        }),

                        DateActived = p.EffectiveDate,

                    }).FirstOrDefault(p => p.Id.ToUpper() == IdApplication.ToUpper());

                    return pcn;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // POST


        // Validation

    }
}