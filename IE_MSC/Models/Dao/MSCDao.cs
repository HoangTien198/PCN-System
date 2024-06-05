using IE_MSC.Models.Ajax;
using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.Json;
using System.Web.Http;
using IE_MSC.Commons;
using IE_MSC.Models.ViewModel;
using System.Security.Cryptography.X509Certificates;
using System.Net;
using System.Text;
using IE_MSC.Models.Upload;
using static IE_MSC.Models.Dao.MSCDao;
using static System.Collections.Specialized.BitVector32;
using System.IO;
using System.Web.Hosting;
using static System.Net.WebRequestMethods;
using System.Drawing;
using System.Web.Configuration;
using System.CodeDom;

namespace IE_MSC.Models.Dao
{
    public class MSCDao
    {

        private PCNDbContext db = null;
        public MSCDao()
        {
            db = new PCNDbContext();
        }

        public class PCNByStatus
        {
            public string Type { get; set; }
            public List<PCNVM> LstPCN { get; set; }
        }
        public string GetMSCByAccount(AccountLogin userLogin)
        {
            try
            {
                List<PCNByStatus> result = new List<PCNByStatus>();

                var pcnWaitUserLogin = db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == 1);

                // Lấy ra danh sách đơn chờ userLogin ký
                var pcnWaitToSign = (from a in db.PCNs.Where(p => p.Status != -1)
                                     join b in pcnWaitUserLogin
                                     on a.PCNID equals b.PCNID
                                     select new PCNVM
                                     {
                                         PCNID = a.PCNID,
                                         PCNCode = a.PCNCode,
                                         AfterChangeDescription = a.AfterChangeDescription,
                                         AfterChangeFile = a.AfterChangeFile,
                                         BeforeChangeDescription = a.BeforeChangeDescription,
                                         BeforeChangeFile = a.BeforeChangeFile,
                                         BossConfirmBy = a.BossConfirmBy,
                                         BossConfirmDate = a.BossConfirmDate,
                                         BossRejectBy = a.BossRejectBy,
                                         BossRejectDate = a.BossRejectDate,
                                         CalculateCost = a.CalculateCost,
                                         CreatedBy = a.CreatedBy,
                                         CreatedDate = a.CreatedDate,
                                         EffectiveDate = a.EffectiveDate,
                                         IEConfirmBy = a.IEConfirmBy,
                                         IEConfirmDate = a.IEConfirmDate,
                                         IERejectBy = a.IERejectBy,
                                         IERejectDate = a.IERejectDate,
                                         ModelTitle = a.ModelTitle,
                                         ProcessTitle = a.ProcessTitle,
                                         Reason = a.Reason,
                                         RecommendedBy = a.RecommendedBy,
                                         RecommendedDate = a.RecommendedDate,
                                         RejectReason = a.RejectReason,
                                         Status = a.Status,
                                         Subject = a.Subject,
                                         UpdatedBy = a.UpdatedBy,
                                         UpdatedDate = a.UpdatedDate,
                                     }).ToList();

                // Lấy ra danh sách đơn userLogin tạo
                var pcnByCreatedByUserLogin = db.PCNs.Where(p => p.CreatedBy == userLogin.EmployeeID).Select(a => new
                PCNVM
                {
                    PCNID = a.PCNID,
                    PCNCode = a.PCNCode,
                    AfterChangeDescription = a.AfterChangeDescription,
                    AfterChangeFile = a.AfterChangeFile,
                    BeforeChangeDescription = a.BeforeChangeDescription,
                    BeforeChangeFile = a.BeforeChangeFile,
                    BossConfirmBy = a.BossConfirmBy,
                    BossConfirmDate = a.BossConfirmDate,
                    BossRejectBy = a.BossRejectBy,
                    BossRejectDate = a.BossRejectDate,
                    CalculateCost = a.CalculateCost,
                    CreatedBy = a.CreatedBy,
                    CreatedDate = a.CreatedDate,
                    EffectiveDate = a.EffectiveDate,
                    IEConfirmBy = a.IEConfirmBy,
                    IEConfirmDate = a.IEConfirmDate,
                    IERejectBy = a.IERejectBy,
                    IERejectDate = a.IERejectDate,
                    ModelTitle = a.ModelTitle,
                    ProcessTitle = a.ProcessTitle,
                    Reason = a.Reason,
                    RecommendedBy = a.RecommendedBy,
                    RecommendedDate = a.RecommendedDate,
                    RejectReason = a.RejectReason,
                    Status = a.Status,
                    Subject = a.Subject,
                    UpdatedBy = a.UpdatedBy,
                    UpdatedDate = a.UpdatedDate,
                }).ToList();

                // Lấy ra danh sách đơn userLogin tạo vào chờ người khác ký
                var pcnWaitingForApproval = (from a in pcnByCreatedByUserLogin
                                             join b in db.PCNs.Where(p => p.Status == 1) // Waiting For Aproval
                                             on a.PCNID equals b.PCNID
                                             select new PCNVM
                                             {
                                                 PCNID = a.PCNID,
                                                 PCNCode = a.PCNCode,
                                                 AfterChangeDescription = a.AfterChangeDescription,
                                                 AfterChangeFile = a.AfterChangeFile,
                                                 BeforeChangeDescription = a.BeforeChangeDescription,
                                                 BeforeChangeFile = a.BeforeChangeFile,
                                                 BossConfirmBy = a.BossConfirmBy,
                                                 BossConfirmDate = a.BossConfirmDate,
                                                 BossRejectBy = a.BossRejectBy,
                                                 BossRejectDate = a.BossRejectDate,
                                                 CalculateCost = a.CalculateCost,
                                                 CreatedBy = a.CreatedBy,
                                                 CreatedDate = a.CreatedDate,
                                                 EffectiveDate = a.EffectiveDate,
                                                 IEConfirmBy = a.IEConfirmBy,
                                                 IEConfirmDate = a.IEConfirmDate,
                                                 IERejectBy = a.IERejectBy,
                                                 IERejectDate = a.IERejectDate,
                                                 ModelTitle = a.ModelTitle,
                                                 ProcessTitle = a.ProcessTitle,
                                                 Reason = a.Reason,
                                                 RecommendedBy = a.RecommendedBy,
                                                 RecommendedDate = a.RecommendedDate,
                                                 RejectReason = a.RejectReason,
                                                 Status = a.Status,
                                                 Subject = a.Subject,
                                                 UpdatedBy = a.UpdatedBy,
                                                 UpdatedDate = a.UpdatedDate,
                                             }).ToList();


                // Lấy ra danh sách đơn đã được xác nhận bowir userlogin
                var pcConfirms = db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == 2);
                var pcnApproved = (from a in pcConfirms
                                   join b in db.PCNs.Select(p => p) // Approved
                                   on a.PCNID equals b.PCNID
                                   select new PCNVM
                                   {
                                       PCNID = b.PCNID,
                                       PCNCode = b.PCNCode,
                                       AfterChangeDescription = b.AfterChangeDescription,
                                       AfterChangeFile = b.AfterChangeFile,
                                       BeforeChangeDescription = b.BeforeChangeDescription,
                                       BeforeChangeFile = b.BeforeChangeFile,
                                       BossConfirmBy = b.BossConfirmBy,
                                       BossConfirmDate = b.BossConfirmDate,
                                       BossRejectBy = b.BossRejectBy,
                                       BossRejectDate = b.BossRejectDate,
                                       CalculateCost = b.CalculateCost,
                                       CreatedBy = b.CreatedBy,
                                       CreatedDate = b.CreatedDate,
                                       EffectiveDate = b.EffectiveDate,
                                       IEConfirmBy = b.IEConfirmBy,
                                       IEConfirmDate = b.IEConfirmDate,
                                       IERejectBy = b.IERejectBy,
                                       IERejectDate = b.IERejectDate,
                                       ModelTitle = b.ModelTitle,
                                       ProcessTitle = b.ProcessTitle,
                                       Reason = b.Reason,
                                       RecommendedBy = b.RecommendedBy,
                                       RecommendedDate = b.RecommendedDate,
                                       RejectReason = b.RejectReason,
                                       Status = b.Status,
                                       Subject = b.Subject,
                                       UpdatedBy = b.UpdatedBy,
                                       UpdatedDate = b.UpdatedDate,
                                   }).ToList();

                // Lấy ra danh sách đơn bị reject bởi userLogin:
                var pcRejects = db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == -1).ToList();
                var pcnRejected = (from a in pcRejects
                                   join b in db.PCNs.Select(p => p) //Rejected
                                   on a.PCNID equals b.PCNID
                                   select new PCNVM
                                   {
                                       PCNID = b.PCNID,
                                       PCNCode = b.PCNCode,
                                       AfterChangeDescription = b.AfterChangeDescription,
                                       AfterChangeFile = b.AfterChangeFile,
                                       BeforeChangeDescription = b.BeforeChangeDescription,
                                       BeforeChangeFile = b.BeforeChangeFile,
                                       BossConfirmBy = b.BossConfirmBy,
                                       BossConfirmDate = b.BossConfirmDate,
                                       BossRejectBy = b.BossRejectBy,
                                       BossRejectDate = b.BossRejectDate,
                                       CalculateCost = b.CalculateCost,
                                       CreatedBy = b.CreatedBy,
                                       CreatedDate = b.CreatedDate,
                                       EffectiveDate = b.EffectiveDate,
                                       IEConfirmBy = b.IEConfirmBy,
                                       IEConfirmDate = b.IEConfirmDate,
                                       IERejectBy = b.IERejectBy,
                                       IERejectDate = b.IERejectDate,
                                       ModelTitle = b.ModelTitle,
                                       ProcessTitle = b.ProcessTitle,
                                       Reason = b.Reason,
                                       RecommendedBy = b.RecommendedBy,
                                       RecommendedDate = b.RecommendedDate,
                                       RejectReason = b.RejectReason,
                                       Status = b.Status,
                                       Subject = b.Subject,
                                       UpdatedBy = b.UpdatedBy,
                                       UpdatedDate = b.UpdatedDate,
                                   }).ToList();

                // Kết quả:
                PCNByStatus lstWaitToSign = new PCNByStatus();
                lstWaitToSign.Type = "Credted By UserLogin";
                lstWaitToSign.LstPCN = pcnByCreatedByUserLogin;
                result.Add(lstWaitToSign);

                PCNByStatus lstWaitForApproval = new PCNByStatus();
                lstWaitForApproval.Type = "Wait For Approval By UserLogin";
                lstWaitForApproval.LstPCN = pcnWaitToSign;
                result.Add(lstWaitForApproval);

                PCNByStatus lstApproved = new PCNByStatus();
                lstApproved.Type = "Approved By User Login";
                lstApproved.LstPCN = pcnApproved;
                result.Add(lstApproved);

                PCNByStatus lstRejected = new PCNByStatus();
                lstRejected.Type = "Rejected By User Login";
                lstRejected.LstPCN = pcnRejected;
                result.Add(lstRejected);

                return JsonSerializer.Serialize(result);
            }
            catch (Exception)
            {
                return "";
            }
            
        }

        public List<PCNVM> GetByFilter(string type)
        {
            try
            {
                IQueryable<PCN> lstPCNs = null;
                if (string.IsNullOrEmpty(type))
                {
                    lstPCNs = db.PCNs.Select(r => r);
                }
                else
                {
                    if (type.Trim().ToLower() == "today")
                    {
                        DateTime startDateTime = DateTime.Today; //Today at 00:00:00
                        DateTime endDateTime = DateTime.Today.AddDays(1).AddTicks(-1); //Today at 23:59:59

                        lstPCNs = db.PCNs.Where(r => r.CreatedDate >= startDateTime && r.CreatedDate <= endDateTime);
                    }
                    if (type.Trim().ToLower() == "last7day")
                    {
                        var last7day = DateTime.Today.AddDays(-7);
                        lstPCNs = db.PCNs.Where(r => r.CreatedDate >= last7day);
                    }
                    if (type.Trim().ToLower() == "month")
                    {
                        var currentYear = DateTime.Now.Year;
                        var currentMonth = DateTime.Now.Month;
                        lstPCNs = db.PCNs.Where(r => r.CreatedDate.Value.Year == currentYear && r.CreatedDate.Value.Month == currentMonth);
                    }
                    if (type.Trim().ToLower() == "year")
                    {
                        var currentYear = DateTime.Now.Year;
                        lstPCNs = db.PCNs.Where(r => r.CreatedDate.Value.Year == currentYear);
                    }
                }
                

                var result = lstPCNs.Select(pcn => new PCNVM
                {
                    PCNID = pcn.PCNID,
                    PCNCode = pcn.PCNCode,
                    AfterChangeDescription = pcn.AfterChangeDescription,
                    AfterChangeFile = pcn.AfterChangeFile,
                    BeforeChangeDescription = pcn.BeforeChangeDescription,
                    BeforeChangeFile = pcn.BeforeChangeFile,
                    BossConfirmBy = pcn.BossConfirmBy,
                    BossConfirmDate = pcn.BossConfirmDate,
                    BossRejectBy = pcn.BossRejectBy,
                    BossRejectDate = pcn.BossRejectDate,
                    CalculateCost = pcn.CalculateCost,
                    CreatedBy = pcn.CreatedBy,
                    CreatedDate = pcn.CreatedDate,
                    EffectiveDate = pcn.EffectiveDate,
                    IEConfirmBy = pcn.IEConfirmBy,
                    IEConfirmDate = pcn.IEConfirmDate,
                    IERejectBy = pcn.IERejectBy,
                    IERejectDate = pcn.IERejectDate,
                    ModelTitle = pcn.ModelTitle,
                    ProcessTitle = pcn.ProcessTitle,
                    Reason = pcn.Reason,
                    RecommendedBy = pcn.RecommendedBy,
                    RecommendedDate = pcn.RecommendedDate,
                    RejectReason = pcn.RejectReason,
                    Status = pcn.Status,
                    Subject = pcn.Subject,
                    UpdatedBy = pcn.UpdatedBy,
                    UpdatedDate = pcn.UpdatedDate,
                }).ToList();
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<PCNVM> GetCreatedByDept(string type)
        {
            try
            {
                IQueryable<PCN> lstPCNs = null;
                if (string.IsNullOrEmpty(type))
                {
                    lstPCNs = db.PCNs.Select(r => r);
                }
                else
                {
                    if (type.Trim().ToLower() == "today")
                    {
                        DateTime startDateTime = DateTime.Today; //Today at 00:00:00
                        DateTime endDateTime = DateTime.Today.AddDays(1).AddTicks(-1); //Today at 23:59:59

                        lstPCNs = db.PCNs.Where(r => r.CreatedDate >= startDateTime && r.CreatedDate <= endDateTime);
                    }
                    if (type.Trim().ToLower() == "last7day")
                    {
                        var last7day = DateTime.Today.AddDays(-7);
                        lstPCNs = db.PCNs.Where(r => r.CreatedDate >= last7day);
                    }
                    if (type.Trim().ToLower() == "month")
                    {
                        var currentYear = DateTime.Now.Year;
                        var currentMonth = DateTime.Now.Month;
                        lstPCNs = db.PCNs.Where(r => r.CreatedDate.Value.Year == currentYear && r.CreatedDate.Value.Month == currentMonth);
                    }
                    if (type.Trim().ToLower() == "year")
                    {
                        var currentYear = DateTime.Now.Year;
                        lstPCNs = db.PCNs.Where(r => r.CreatedDate.Value.Year == currentYear);
                    }
                }

                var result = lstPCNs.Select(pcn => new PCNVM
                {
                    PCNID = pcn.PCNID,
                    PCNCode = pcn.PCNCode,
                    AfterChangeDescription = pcn.AfterChangeDescription,
                    AfterChangeFile = pcn.AfterChangeFile,
                    BeforeChangeDescription = pcn.BeforeChangeDescription,
                    BeforeChangeFile = pcn.BeforeChangeFile,
                    BossConfirmBy = pcn.BossConfirmBy,
                    BossConfirmDate = pcn.BossConfirmDate,
                    BossRejectBy = pcn.BossRejectBy,
                    BossRejectDate = pcn.BossRejectDate,
                    CalculateCost = pcn.CalculateCost,
                    CreatedBy = pcn.CreatedBy,
                    CreatedDate = pcn.CreatedDate,
                    EffectiveDate = pcn.EffectiveDate,
                    IEConfirmBy = pcn.IEConfirmBy,
                    IEConfirmDate = pcn.IEConfirmDate,
                    IERejectBy = pcn.IERejectBy,
                    IERejectDate = pcn.IERejectDate,
                    ModelTitle = pcn.ModelTitle,
                    ProcessTitle = pcn.ProcessTitle,
                    Reason = pcn.Reason,
                    RecommendedBy = pcn.RecommendedBy,
                    RecommendedDate = pcn.RecommendedDate,
                    RejectReason = pcn.RejectReason,
                    Status = pcn.Status,
                    Subject = pcn.Subject,
                    UpdatedBy = pcn.UpdatedBy,
                    UpdatedDate = pcn.UpdatedDate,
                }).ToList();


                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public string GetMSCByBoss(AccountLogin userLogin)
        {
            try
            {
                List<PCNByStatus> result = new List<PCNByStatus>();

                var pcnWaitUserLogin = db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == 1);

                // Lấy ra danh sách đơn chờ userLogin ký
                var pcnWaitToSign = (from a in db.PCNs.Where(p => p.Status != -1)
                                     join b in pcnWaitUserLogin
                                     on a.PCNID equals b.PCNID
                                     select new PCNVM
                                     {
                                         PCNID = a.PCNID,
                                         PCNCode = a.PCNCode,
                                         AfterChangeDescription = a.AfterChangeDescription,
                                         AfterChangeFile = a.AfterChangeFile,
                                         BeforeChangeDescription = a.BeforeChangeDescription,
                                         BeforeChangeFile = a.BeforeChangeFile,
                                         BossConfirmBy = a.BossConfirmBy,
                                         BossConfirmDate = a.BossConfirmDate,
                                         BossRejectBy = a.BossRejectBy,
                                         BossRejectDate = a.BossRejectDate,
                                         CalculateCost = a.CalculateCost,
                                         CreatedBy = a.CreatedBy,
                                         CreatedDate = a.CreatedDate,
                                         EffectiveDate = a.EffectiveDate,
                                         IEConfirmBy = a.IEConfirmBy,
                                         IEConfirmDate = a.IEConfirmDate,
                                         IERejectBy = a.IERejectBy,
                                         IERejectDate = a.IERejectDate,
                                         ModelTitle = a.ModelTitle,
                                         ProcessTitle = a.ProcessTitle,
                                         Reason = a.Reason,
                                         RecommendedBy = a.RecommendedBy,
                                         RecommendedDate = a.RecommendedDate,
                                         RejectReason = a.RejectReason,
                                         Status = a.Status,
                                         Subject = a.Subject,
                                         UpdatedBy = a.UpdatedBy,
                                         UpdatedDate = a.UpdatedDate,
                                     }).ToList();

                // Lấy ra danh sách đơn userLogin tạo
                var pcnByCreatedByUserLogin = db.PCNs.Where(p => p.CreatedBy == userLogin.EmployeeID);

                // Lấy ra danh sách đơn userLogin tạo vào chờ người khác ký
                var pcnWaitingForApproval = (from a in pcnByCreatedByUserLogin
                                             join b in db.PCNs.Where(p => p.Status == 1) // Waiting For Aproval
                                             on a.PCNID equals b.PCNID
                                             select new PCNVM
                                             {
                                                 PCNID = a.PCNID,
                                                 PCNCode = a.PCNCode,
                                                 AfterChangeDescription = a.AfterChangeDescription,
                                                 AfterChangeFile = a.AfterChangeFile,
                                                 BeforeChangeDescription = a.BeforeChangeDescription,
                                                 BeforeChangeFile = a.BeforeChangeFile,
                                                 BossConfirmBy = a.BossConfirmBy,
                                                 BossConfirmDate = a.BossConfirmDate,
                                                 BossRejectBy = a.BossRejectBy,
                                                 BossRejectDate = a.BossRejectDate,
                                                 CalculateCost = a.CalculateCost,
                                                 CreatedBy = a.CreatedBy,
                                                 CreatedDate = a.CreatedDate,
                                                 EffectiveDate = a.EffectiveDate,
                                                 IEConfirmBy = a.IEConfirmBy,
                                                 IEConfirmDate = a.IEConfirmDate,
                                                 IERejectBy = a.IERejectBy,
                                                 IERejectDate = a.IERejectDate,
                                                 ModelTitle = a.ModelTitle,
                                                 ProcessTitle = a.ProcessTitle,
                                                 Reason = a.Reason,
                                                 RecommendedBy = a.RecommendedBy,
                                                 RecommendedDate = a.RecommendedDate,
                                                 RejectReason = a.RejectReason,
                                                 Status = a.Status,
                                                 Subject = a.Subject,
                                                 UpdatedBy = a.UpdatedBy,
                                                 UpdatedDate = a.UpdatedDate,
                                             }).ToList();

                var temp1 = db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == 2).ToList();
                // Lấy ra danh sách đơn userLogin tạo và đã được xác nhận
                var pcnApproved = (from a in db.PCNConfirms.Where(pc=>pc.EmployeeID == userLogin.EmployeeID && pc.Status == 2)
                                   join b in db.PCNs.Select(p => p) // Approved
                                   on a.PCNID equals b.PCNID
                                   select new PCNVM
                                   {
                                       PCNID = a.PCNID,
                                       PCNCode = b.PCNCode,
                                       AfterChangeDescription = b.AfterChangeDescription,
                                       AfterChangeFile = b.AfterChangeFile,
                                       BeforeChangeDescription = b.BeforeChangeDescription,
                                       BeforeChangeFile = b.BeforeChangeFile,
                                       BossConfirmBy = b.BossConfirmBy,
                                       BossConfirmDate = b.BossConfirmDate,
                                       BossRejectBy = b.BossRejectBy,
                                       BossRejectDate = b.BossRejectDate,
                                       CalculateCost = b.CalculateCost,
                                       CreatedBy = b.CreatedBy,
                                       CreatedDate = b.CreatedDate,
                                       EffectiveDate = b.EffectiveDate,
                                       IEConfirmBy = b.IEConfirmBy,
                                       IEConfirmDate = b.IEConfirmDate,
                                       IERejectBy = b.IERejectBy,
                                       IERejectDate = b.IERejectDate,
                                       ModelTitle = b.ModelTitle,
                                       ProcessTitle = b.ProcessTitle,
                                       Reason = b.Reason,
                                       RecommendedBy = b.RecommendedBy,
                                       RecommendedDate = b.RecommendedDate,
                                       RejectReason = b.RejectReason,
                                       Status = b.Status,
                                       Subject = b.Subject,
                                       UpdatedBy = b.UpdatedBy,
                                       UpdatedDate = b.UpdatedDate,
                                   }).ToList();


                var temp2 = db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == -1).ToList();
                // Lấy ra danh sách đơn chờ userLogin tạo và bị reject
                var pcnRejected = (from a in db.PCNConfirms.Where(pc => pc.EmployeeID == userLogin.EmployeeID && pc.Status == -1)
                                   join b in db.PCNs.Select(p => p) //Rejected
                                   on a.PCNID equals b.PCNID
                                   select new PCNVM
                                   {
                                       PCNID = a.PCNID,
                                       PCNCode = b.PCNCode,
                                       AfterChangeDescription = b.AfterChangeDescription,
                                       AfterChangeFile = b.AfterChangeFile,
                                       BeforeChangeDescription = b.BeforeChangeDescription,
                                       BeforeChangeFile = b.BeforeChangeFile,
                                       BossConfirmBy = b.BossConfirmBy,
                                       BossConfirmDate = b.BossConfirmDate,
                                       BossRejectBy = b.BossRejectBy,
                                       BossRejectDate = b.BossRejectDate,
                                       CalculateCost = b.CalculateCost,
                                       CreatedBy = b.CreatedBy,
                                       CreatedDate = b.CreatedDate,
                                       EffectiveDate = b.EffectiveDate,
                                       IEConfirmBy = b.IEConfirmBy,
                                       IEConfirmDate = b.IEConfirmDate,
                                       IERejectBy = b.IERejectBy,
                                       IERejectDate = b.IERejectDate,
                                       ModelTitle = b.ModelTitle,
                                       ProcessTitle = b.ProcessTitle,
                                       Reason = b.Reason,
                                       RecommendedBy = b.RecommendedBy,
                                       RecommendedDate = b.RecommendedDate,
                                       RejectReason = b.RejectReason,
                                       Status = b.Status,
                                       Subject = b.Subject,
                                       UpdatedBy = b.UpdatedBy,
                                       UpdatedDate = b.UpdatedDate,
                                   }).ToList();

                // Kết quả:
                PCNByStatus lstWaitToSign = new PCNByStatus();
                lstWaitToSign.Type = "Wait To Sign";
                lstWaitToSign.LstPCN = pcnWaitToSign;
                result.Add(lstWaitToSign);

                PCNByStatus lstWaitForApproval = new PCNByStatus();
                lstWaitForApproval.Type = "Wait For Approval";
                lstWaitForApproval.LstPCN = pcnWaitingForApproval;
                result.Add(lstWaitForApproval);

                PCNByStatus lstApproved = new PCNByStatus();
                lstApproved.Type = "Approved";
                lstApproved.LstPCN = pcnApproved;
                result.Add(lstApproved);

                PCNByStatus lstRejected = new PCNByStatus();
                lstRejected.Type = "Rejected";
                lstRejected.LstPCN = pcnRejected;
                result.Add(lstRejected);

                return JsonSerializer.Serialize(result);
            }
            catch (Exception)
            {

                return "";
            }

        }

        public string Get()
        {
            var MSCVMs = db.PCNs.Select(pcn => new PCNVM
            {
                PCNID = pcn.PCNID,
                PCNCode = pcn.PCNCode,
                AfterChangeDescription = pcn.AfterChangeDescription,
                AfterChangeFile = pcn.AfterChangeFile,
                BeforeChangeDescription = pcn.BeforeChangeDescription,
                BeforeChangeFile = pcn.BeforeChangeFile,
                BossConfirmBy = pcn.BossConfirmBy,
                BossConfirmDate = pcn.BossConfirmDate,
                BossRejectBy = pcn.BossRejectBy,
                BossRejectDate = pcn.BossRejectDate,
                CalculateCost = pcn.CalculateCost,
                CreatedBy = pcn.CreatedBy,
                CreatedDate = pcn.CreatedDate,
                EffectiveDate = pcn.EffectiveDate,
                IEConfirmBy = pcn.IEConfirmBy,
                IEConfirmDate = pcn.IEConfirmDate,
                IERejectBy = pcn.IERejectBy,
                IERejectDate = pcn.IERejectDate,
                ModelTitle = pcn.ModelTitle,
                ProcessTitle = pcn.ProcessTitle,
                Reason = pcn.Reason,
                RecommendedBy = pcn.RecommendedBy,
                RecommendedDate = pcn.RecommendedDate,
                RejectReason = pcn.RejectReason,
                Status = pcn.Status,
                Subject = pcn.Subject,
                UpdatedBy = pcn.UpdatedBy,
                UpdatedDate = pcn.UpdatedDate,
            }).OrderByDescending(m => m.RecommendedDate);
            var json = JsonSerializer.Serialize(MSCVMs);
            return json;
        }

        /// <summary>
        /// Hàm lấy 1 bản ghi PCN theo id
        /// </summary>
        /// <param name="id">ID của MSC</param>
        /// <returns>MSC (View Model)</returns>
        public PCNVM GetById(string id)
        {
            try
            {
                var pcn = db.PCNs.FirstOrDefault(s => s.PCNID == id);
                return new PCNVM
                {
                    PCNID = pcn.PCNID,
                    PCNCode = pcn.PCNCode,
                    AfterChangeDescription = pcn.AfterChangeDescription,
                    AfterChangeFile = pcn.AfterChangeFile,
                    BeforeChangeDescription = pcn.BeforeChangeDescription,
                    BeforeChangeFile = pcn.BeforeChangeFile,
                    BossConfirmBy = pcn.BossConfirmBy,
                    BossConfirmDate = pcn.BossConfirmDate,
                    BossRejectBy = pcn.BossRejectBy,
                    BossRejectDate = pcn.BossRejectDate,
                    CalculateCost = pcn.CalculateCost,
                    CreatedBy = pcn.CreatedBy,
                    CreatedDate = pcn.CreatedDate,
                    EffectiveDate = pcn.EffectiveDate,
                    IEConfirmBy = pcn.IEConfirmBy,
                    IEConfirmDate = pcn.IEConfirmDate,
                    IERejectBy = pcn.IERejectBy,
                    IERejectDate = pcn.IERejectDate,
                    ModelTitle = pcn.ModelTitle,
                    ProcessTitle = pcn.ProcessTitle,
                    Reason = pcn.Reason,
                    RecommendedBy = pcn.RecommendedBy,
                    RecommendedDate = pcn.RecommendedDate,
                    RejectReason = pcn.RejectReason,
                    Status = pcn.Status,
                    Subject = pcn.Subject,
                    UpdatedBy = pcn.UpdatedBy,
                    UpdatedDate = pcn.UpdatedDate,
                };
            }
            catch (Exception)
            {
                return null;
            }

        }


        /// <summary>
        /// Hàm lưu 1 bản ghi MSC sau khi có bộ phận tạo mới
        /// </summary>
        /// <param name="data">Object: MSC</param>
        /// <param name="userLogin">Thông tin của người tạo đơn</param>
        /// <returns>1: Success,</returns>
        public string SaveMSCAfterCreate(AjaxMSC data, AccountLogin userLogin)
        {
            try
            {
                var lstSendMailError = new List<string>();

                #region Tạo đơn PCN mới
                var pcnID = Guid.NewGuid().ToString();
                var dtNow = DateTime.Now;
                var pcn = new PCN
                {
                    PCNID = pcnID,
                };
                var pcnCode = "PCN_" + DateTime.Now.ToString("yyMMddhhmmssfff");

                pcn.PCNID = pcnID;
                pcn.PCNCode = pcnCode;
                pcn.RecommendedBy = userLogin.EmployeeID;
                pcn.RecommendedDate = dtNow;
                pcn.Subject = data.Subject.Trim();
                pcn.ProcessTitle = data.ProcessTitle.Trim();
                pcn.BeforeChangeDescription = Base64DecodeToString(data.BeforeChangeDescription);
                pcn.AfterChangeDescription = Base64DecodeToString(data.AfterChangeDescription.Trim());
                pcn.ModelTitle = data.ModelTitle.Trim();
                pcn.Reason = Base64DecodeToString(data.Reason.Trim());
                pcn.Status = 1;// Chờ xác nhận
                pcn.ProcessTitle = data.ProcessTitle.Trim();
                pcn.ProcessTitle = data.ProcessTitle.Trim();
                pcn.CreatedDate = dtNow;
                pcn.CreatedBy = userLogin.EmployeeID;

                // File Input:
                if (data.BeforeChangeFile != null)//có file
                {
                    string _fileName = Path.GetFileName(data.BeforeChangeFile.FileName);
                    //---------- Lấy đuôi file:
                    string fileEnd = Path.GetExtension(_fileName);
                    //---------- Chuẩn hóa tên file: SOP_Guild_StationName.[đuôi file]
                    _fileName = "PCN_" + FormatUnicode.ReplaceUnicode(pcnCode) + "_" + Guid.NewGuid() + "_" + "Before" + fileEnd.ToLower();
                    //---------- Lưu file vào đường dẫn: Dùng HostingEnvironment.MapPath thay cho Path.Combine(Server.MapPath): 
                    string path = HostingEnvironment.MapPath(@"~\Assets\Media\FileMSC\" + _fileName);
                    data.BeforeChangeFile.SaveAs(path);

                    //Insert to db:
                    pcn.BeforeChangeFile = _fileName;
                }
                if (data.AfterChangeFile != null)//có file
                {
                    string _fileName = Path.GetFileName(data.AfterChangeFile.FileName);
                    //---------- Lấy đuôi file:
                    string fileEnd = Path.GetExtension(_fileName);
                    //Save file pdf:
                    //---------- Chuẩn hóa tên file: SOP_Guild_StationName.[đuôi file]
                    _fileName = "PCN_" + FormatUnicode.ReplaceUnicode(pcnCode) + "_" + Guid.NewGuid() + "_" + "After" + fileEnd.ToLower();
                    //---------- Lưu file vào đường dẫn: Dùng HostingEnvironment.MapPath thay cho Path.Combine(Server.MapPath): 
                    string path = HostingEnvironment.MapPath(@"~\Assets\Media\FileMSC\" + _fileName);
                    data.AfterChangeFile.SaveAs(path);

                    //Insert to db:
                    pcn.AfterChangeFile = _fileName;
                }

                db.PCNs.Add(pcn);
                db.SaveChanges();
                #endregion

                #region Gán trạng thái cho employee
                // lấy danh sách employeeID truyền vào:
                Root lstOwnerObject = JsonSerializer.Deserialize<Root>(data.LstOwnerSelected);

                var realSortOrder = 0;
                foreach (var item in lstOwnerObject.LstOwnerSelected)
                {
                    realSortOrder++;
                    var pcnConfirm = new PCNConfirm();
                    pcnConfirm.EmployeeID = item.EmployeeID;
                    pcnConfirm.PCNID = pcnID;
                    pcnConfirm.SortOrder = item.SortOrder;
                    pcnConfirm.Status = 1;//Chờ xác nhận
                    db.PCNConfirms.Add(pcnConfirm);
                    db.SaveChanges();
                }

                if (data.SendToBoss == true)
                {
                    var boss = db.Employees.FirstOrDefault(e => e.IsBoss == true);
                    realSortOrder++;
                    var pcnBossConfirm = new PCNConfirm();
                    pcnBossConfirm.EmployeeID = boss.EmployeeID;
                    pcnBossConfirm.PCNID = pcnID;
                    pcnBossConfirm.SortOrder = realSortOrder;
                    pcnBossConfirm.Status = 1;// Chờ boss xác nhận
                    db.PCNConfirms.Add(pcnBossConfirm);
                    db.SaveChanges();
                }
                #endregion

                //#region Gửi Mail cho những employee không phải của IE

                //var countIE = 0;
                //var dao = new EmployeeDao();
                //foreach (var emp in lstOwnerObject.LstOwnerSelected)
                //{
                //    if (dao.CheckEmployeeInIE(emp.EmployeeID) != 0)
                //    {
                //        countIE++;
                //    }
                //}

                //if (countIE != lstOwnerObject.LstOwnerSelected.Count)
                //{
                //    foreach (var emp in lstOwnerObject.LstOwnerSelected)
                //    {
                //        if (dao.GetByID(emp.EmployeeID).IsBoss == false)
                //        {
                //            if (dao.CheckEmployeeInIE(emp.EmployeeID) == 0)
                //            {
                //                //Send Mail:
                //                var mailTo = dao.GetByID(emp.EmployeeID).Email;
                //                var temp = this.SendMailMSC(pcnID, mailTo);
                //                if (temp == false)
                //                {
                //                    lstSendMailError.Add(mailTo);
                //                }
                //            }
                //        }
                //        else
                //        {
                //            if (lstOwnerObject.LstOwnerSelected.Count == 1)
                //            {
                //                var mailTo = dao.GetByID(emp.EmployeeID).Email;
                //                var temp = this.SendMailMSC(pcnID, mailTo);
                //                if (temp == false)
                //                {
                //                    lstSendMailError.Add(mailTo);
                //                }
                //            }
                //        }
                //    }
                //}
                //else
                //{
                //    //Send mail to IE:
                //    foreach (var emp in lstOwnerObject.LstOwnerSelected)
                //    {
                //        //Send Mail:
                //        var mailTo = dao.GetByID(emp.EmployeeID).Email;
                //        var temp = this.SendMailMSC(pcnID, mailTo);
                //        if (temp == false)
                //        {
                //            lstSendMailError.Add(mailTo);
                //        }
                //    }

                //}
                //#endregion

                #region Gửi mail cho người đầu tiên
                // Gửi mail cho người đầu tiên:
                var empDao = new EmployeeDao();
                var user = empDao.GetByID(lstOwnerObject.LstOwnerSelected[0].EmployeeID);
                var check = SendMailMSC(pcnID, user.Email);

                if (check == false)
                {
                    lstSendMailError.Add(user.Email); 
                }
                
                #endregion

                if (lstSendMailError.Count > 0)
                {
                    return JsonSerializer.Serialize(lstSendMailError);
                }
                else
                {
                    return "1";
                }
            }
            catch (Exception)
            {

                return "";
            }
        }

        public string SaveMSCAfterEdit(AjaxMSC data, AccountLogin userLogin)
        {
            try
            {
                var lstSendMailError = new List<string>();
                var mscDb = db.PCNs.FirstOrDefault(m => m.PCNID == data.PCNID);

                if (mscDb.CreatedBy != userLogin.EmployeeID)
                {
                    return "Not authorized";
                }
                else
                {
                    mscDb.Subject = data.Subject.Trim();
                    mscDb.ProcessTitle = data.ProcessTitle.Trim();
                    mscDb.BeforeChangeDescription = Base64DecodeToString(data.BeforeChangeDescription);
                    mscDb.AfterChangeDescription = Base64DecodeToString(data.AfterChangeDescription.Trim());
                    mscDb.ModelTitle = data.ModelTitle.Trim();
                    mscDb.Reason = Base64DecodeToString(data.Reason.Trim());
                    mscDb.UpdatedDate = DateTime.Now;
                    mscDb.UpdatedBy = userLogin.EmployeeID;
                    // File Input:
                    if (data.BeforeChangeFile != null)//có file
                    {
                        string _fileName = Path.GetFileName(data.BeforeChangeFile.FileName);
                        //---------- Lấy đuôi file:
                        string fileEnd = Path.GetExtension(_fileName);
                        //---------- Chuẩn hóa tên file: SOP_Guild_StationName.[đuôi file]
                        _fileName = "PCN_" + FormatUnicode.ReplaceUnicode(mscDb.PCNCode) + "_" + Guid.NewGuid() + "_" + "Before" + fileEnd.ToLower();
                        //---------- Lưu file vào đường dẫn: Dùng HostingEnvironment.MapPath thay cho Path.Combine(Server.MapPath): 
                        string path = HostingEnvironment.MapPath(@"~\Assets\Media\FileMSC\" + _fileName);
                        data.BeforeChangeFile.SaveAs(path);

                        //Insert to db:
                        mscDb.BeforeChangeFile = _fileName;
                    }
                    if (data.AfterChangeFile != null)//có file
                    {
                        string _fileName = Path.GetFileName(data.AfterChangeFile.FileName);
                        //---------- Lấy đuôi file:
                        string fileEnd = Path.GetExtension(_fileName);
                        //Save file pdf:
                        //---------- Chuẩn hóa tên file: SOP_Guild_StationName.[đuôi file]
                        _fileName = "PCN_" + FormatUnicode.ReplaceUnicode(mscDb.PCNCode) + "_" + Guid.NewGuid() + "_" + "After" + fileEnd.ToLower();
                        //---------- Lưu file vào đường dẫn: Dùng HostingEnvironment.MapPath thay cho Path.Combine(Server.MapPath): 
                        string path = HostingEnvironment.MapPath(@"~\Assets\Media\FileMSC\" + _fileName);
                        data.AfterChangeFile.SaveAs(path);

                        //Insert to db:
                        mscDb.AfterChangeFile = _fileName;
                    }

                    var empDao = new EmployeeDao();
                    if (empDao.CheckEmployeeInIE(userLogin.EmployeeID)!= 0)// IE
                    {
                        mscDb.CalculateCost = Base64DecodeToString(data.CalculateCost);
                    }
                    db.SaveChanges();

                    #region Gán trạng thái cho employee
                    // Xoá hết dữ liệu cũ:
                    var empConf = db.PCNConfirms.Where(p => p.PCNID == mscDb.PCNID);
                    if (empConf != null)
                    {
                        db.PCNConfirms.RemoveRange(empConf);
                    }
                    // lấy danh sách employeeID truyền vào:
                    Root lstOwnerObject = JsonSerializer.Deserialize<Root>(data.LstOwnerSelected);
                    var dao = new EmployeeDao();
                    var countIE = 0;
                    var realSortOrder = 0;
                    foreach (var item in lstOwnerObject.LstOwnerSelected)
                    {
                        if (dao.CheckEmployeeInIE(item.EmployeeID) != 0)
                        {
                            countIE++;
                        }
                        realSortOrder++;
                        var pcnConfirm = new PCNConfirm();
                        pcnConfirm.EmployeeID = item.EmployeeID;
                        pcnConfirm.PCNID = mscDb.PCNID;
                        pcnConfirm.SortOrder = item.SortOrder;
                        pcnConfirm.Status = 1;//Chờ xác nhận
                        db.PCNConfirms.Add(pcnConfirm);
                        db.SaveChanges();
                    }

                    if (data.SendToBoss == true)
                    {
                        var boss = db.Employees.FirstOrDefault(e => e.IsBoss == true);
                        realSortOrder++;
                        var pcnBossConfirm = new PCNConfirm();
                        pcnBossConfirm.EmployeeID = boss.EmployeeID;
                        pcnBossConfirm.PCNID = mscDb.PCNID;
                        pcnBossConfirm.SortOrder = realSortOrder;
                        pcnBossConfirm.Status = 1;// Chờ boss xác nhận
                        db.PCNConfirms.Add(pcnBossConfirm);
                        db.SaveChanges();
                    }
                    #endregion

                    #region Gửi Mail cho những employee không phải của IE
                    
                    if (countIE != lstOwnerObject.LstOwnerSelected.Count)
                    {
                        foreach (var emp in lstOwnerObject.LstOwnerSelected)
                        {
                            if (dao.GetByID(emp.EmployeeID).IsBoss == false)
                            {
                                if (dao.CheckEmployeeInIE(emp.EmployeeID) == 0)
                                {
                                    //Send Mail:
                                    var mailTo = dao.GetByID(emp.EmployeeID).Email;
                                    var temp = this.SendMailMSC(mscDb.PCNID, mailTo);
                                    if (temp == false)
                                    {
                                        lstSendMailError.Add(mailTo);
                                    }
                                }
                            }
                            else
                            {
                                if (lstOwnerObject.LstOwnerSelected.Count == 1)
                                {
                                    var mailTo = dao.GetByID(emp.EmployeeID).Email;
                                    var temp= this.SendMailMSC(mscDb.PCNID, mailTo);
                                    if (temp == false)
                                    {
                                        lstSendMailError.Add(mailTo);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        //Send mail to IE:
                        foreach (var emp in lstOwnerObject.LstOwnerSelected)
                        {
                            //Send Mail:
                            var mailTo = dao.GetByID(emp.EmployeeID).Email;
                            var temp = this.SendMailMSC(mscDb.PCNID, mailTo);
                            if (temp == false)
                            {
                                lstSendMailError.Add(mailTo);
                            }
                        }

                    }
                    #endregion
                    if (lstSendMailError.Count > 0)
                    {
                        return JsonSerializer.Serialize(lstSendMailError);
                    }
                    else
                    {
                        return "1";
                    }
                }
            }
            catch (Exception)
            {
                return "";
            }

        }

        public int SaveCalculateCostIE(string PCNID, string calculateCost)
        {
            try
            {
                var pcn = db.PCNs.FirstOrDefault(m => m.PCNID == PCNID);
                pcn.CalculateCost = Base64DecodeToString(calculateCost);
                //kiểm tra các phòng ban đã kí hết chưa:
                db.SaveChanges();
                return 1;

            }
            catch (Exception)
            {
                return 0;
            }
        }

        public int ConfirmMSC(string pcnID, string employeeID, AccountLogin userLogin)
        {
            try
            {
                if (employeeID == userLogin.EmployeeID)
                {
                    // kiểm tra xem những đơn kí trước đã dk kí chưa
                    bool checkSign = checkSortOrderBefore(pcnID, employeeID);
                    if (checkSign == true)
                    {
                        var dtNow = DateTime.Now;
                        var pcnConfirm = db.PCNConfirms.FirstOrDefault(p => p.PCNID == pcnID && p.EmployeeID == employeeID);
                        pcnConfirm.Status = 2;// đã xác nhận
                        pcnConfirm.ConfirmedBy = userLogin.EmployeeID;
                        pcnConfirm.ConfirmedDate = DateTime.Now;
                        db.SaveChanges();

                        // Nếu tất cả các phòng ban đã confirm:
                        if (CheckAllOwnerConfirm(pcnID) == true)
                        {
                            var pcn = db.PCNs.FirstOrDefault(p => p.PCNID == pcnID);
                            pcn.Status = 2;
                            pcn.EffectiveDate = DateTime.Now;
                            db.SaveChanges();
                            return 1;

                        }
                        else
                        {
                            //Send Mail cho sort order tiếp theo:
                            //lấy ra max SortOrder
                            var maxSortOrder = db.PCNConfirms.Max(pc => pc.Status);
                            if (pcnConfirm.SortOrder < maxSortOrder)
                            {
                                var temp = pcnConfirm.SortOrder + 1;
                                var nextPcnConfirm = db.PCNConfirms.FirstOrDefault(p => p.PCNID == pcnID && p.SortOrder == temp);
                                var emp = db.Employees.FirstOrDefault(e => e.EmployeeID == nextPcnConfirm.EmployeeID);
                                this.SendMailMSC(pcnID, emp.EmployeeID);
                            }

                            return 1;

                        }
                    }
                    else
                    {
                        return 2;// Chưa đến lượt kí 
                    }
                }
                else
                {
                    return 0;// Không có quyền kí
                }
            }
            catch (Exception)
            {
                return -1;// Server Error
            }
            

        }

        public bool SendMailMSC(string pcnID, string mailTo)
        {
            try
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                var pcn = db.PCNs.FirstOrDefault(m => m.PCNID == pcnID);
                var mailContentHTML = $"PCN System: <a href=\"https://10.220.130.116:6688\">https://10.220.130.116:6688</a> (open with Microsoft Edge or Google Chrome, please!)<br/>There is an PCN application waiting to be signed.<br/>PCN Code: {pcn.PCNCode}<br/>Subject: {FormatUnicode.ReplaceUnicode(pcn.Subject)}<br/>Process: {FormatUnicode.ReplaceUnicode(pcn.ProcessTitle)} <br/>Model: {FormatUnicode.ReplaceUnicode(pcn.ModelTitle)}";
                string apiUrl = "https://10.220.130.117:8888/api/Service/SendMail";
                var sendMail = new SendMail();
                //sendMail.MailTo = "you-nan.ruan@mail.foxconn.com";
                sendMail.MailTo = mailTo;
                sendMail.MailCC = "";
                sendMail.MailSubject = "Message from the Process Change Notice (PCN) system: You have an PCN application waiting to be signed.";
                //sendMail.MailContent = "MSC System: https://10.220.130.116:4444 (open with Microft Edge or Google Chrome, please!)\nThere is an MSC application waiting to be signed." + "\nMSC Code: " + msc.MSCCode + "\nModel Title: " + msc.ModelTitle;
                sendMail.MailContent = mailContentHTML;
                sendMail.MailType = "html";
                var jsonResult = JsonSerializer.Serialize(sendMail);
                WebClient client = new WebClient();
                client.Headers["Content-type"] = "application/json";
                client.Encoding = Encoding.UTF8;
                client.UploadString(apiUrl, jsonResult);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
       
        public string Base64DecodeToString(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public bool CheckAllOwnerConfirm(string pcnID)
        {
            var pc = db.PCNConfirms.Where(s => s.PCNID == pcnID).OrderBy(s=>s.Status);
            var countConfirm = 0;
            foreach (var item in pc)
            {
                if(item.Status == 2)
                {
                    countConfirm++;
                }
            }

            if (countConfirm == pc.Count())
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public int RejectMSC(PCNConfirmVM data, AccountLogin userLogin)
        {
            try
            {
                if (userLogin.EmployeeID == data.EmployeeID)
                {
                    bool checkReject = checkSortOrderBefore(data.PCNID, data.EmployeeID);
                    //if (checkReject == true)
                    //{
                    //    var pcnConfirm = db.PCNConfirms.FirstOrDefault(p => p.EmployeeID == data.EmployeeID && p.PCNID == data.PCNID);
                    //    pcnConfirm.Status = -1;//Reject
                    //    pcnConfirm.ReasonReject = data.ReasonReject;
                    //    pcnConfirm.RejectedDate = DateTime.Now;
                    //    pcnConfirm.RejectedBy = userLogin.EmployeeID;
                    //    db.SaveChanges();
                    //    var pcn = db.PCNs.FirstOrDefault(p => p.PCNID == data.PCNID);
                    //    pcn.Status = -1;
                    //    pcn.RejectReason = data.ReasonReject;
                    //    db.SaveChanges();
                    //    return 1; // OK
                    //}
                    //else
                    //{
                    //    return 2;// Chưa đến lượt
                    //}
                    var pcnConfirm = db.PCNConfirms.FirstOrDefault(p => p.EmployeeID == data.EmployeeID && p.PCNID == data.PCNID);
                    pcnConfirm.Status = -1;//Reject
                    pcnConfirm.ReasonReject = data.ReasonReject;
                    pcnConfirm.RejectedDate = DateTime.Now;
                    pcnConfirm.RejectedBy = userLogin.EmployeeID;
                    db.SaveChanges();
                    var pcn = db.PCNs.FirstOrDefault(p => p.PCNID == data.PCNID);
                    pcn.Status = -1;
                    pcn.RejectReason = data.ReasonReject;
                    db.SaveChanges();
                    return 1; // OK
                }
                else
                {
                    return 0; // Khong dk quyen kis
                }
                
            }
            catch (Exception)
            {

                return -1;//Server error
            }
        }

        /// <summary>
        /// Kiểm tra các phòng ban trước đã kí chưa
        /// </summary>
        /// <param name="pcnID"></param>
        /// <param name="employeeID"></param>
        /// <returns>true: đã kí hết | false: chưa kí hết</returns>
        public bool checkSortOrderBefore(string pcnID, string employeeID)
        {
            var record = db.PCNConfirms.FirstOrDefault(pc => pc.EmployeeID == employeeID && pc.PCNID == pcnID);
            var allOrder = db.PCNConfirms.Where(pc => pc.PCNID == pcnID && pc.SortOrder < record.SortOrder);
            foreach (var item in allOrder)
            {
                if (item.Status < 2)// các phòng ban ở trước chưa xác nhận hết
                {
                    return false;
                }
            }
            return true;
        }

        public int Delete(string pcnID)
        {
            try
            {
                //xóa trong bảng pcnConfirm:
                var pcnConfirms = db.PCNConfirms.Where(p => p.PCNID == pcnID);
                db.PCNConfirms.RemoveRange(pcnConfirms);
                db.SaveChanges();

                var pcn = db.PCNs.FirstOrDefault(p => p.PCNID == pcnID);
                db.PCNs.Remove(pcn);
                db.SaveChanges();
                return 1;
            }
            catch (Exception)
            {
                return -1;
                throw;
            }
        }
    }
}