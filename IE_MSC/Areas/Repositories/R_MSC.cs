using IE_MSC.Areas.Entities;
using IE_MSC.Commons;
using IE_MSC.Models.Entities;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_MSC
    {
        /* GET */
        public static Entities.MSC GetApplication(string IdApplication)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;


                    var msc = context.MSCs.Include(m => m.Signs)
                                          .Include(m => m.Signs.Select(s => s.User.UserDepartments.Select(ud => ud.Department.Customer)))
                                          .FirstOrDefault(m => m.Id.ToUpper() == IdApplication.ToUpper());

                    msc.UserCreated = context.Users.Include(u => u.UserDepartments.Select(d => d.Department.Customer))
                                                   .FirstOrDefault(u => u.Id.ToUpper() == msc.IdUserCreated);
                    msc.Signs = msc.Signs.OrderBy(s => s.Order).ToList();

                    return msc;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetApplications()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var mscs = context.MSCs.Select(m => new
                    {
                        m.Id,
                        m.Code,
                        m.Subject,
                        m.Status,
                        m.IdUserCreated,
                        UserCreated = context.Users.FirstOrDefault(u => u.Id.ToUpper() == m.IdUserCreated),
                    }).ToList();

                    return mscs;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static string GetApplicationDepartment(string IdApplication)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;


                    var msc = context.MSCs.FirstOrDefault(m => m.Id.ToUpper() == IdApplication.ToUpper());

                    msc.Department = context.Departments.FirstOrDefault(d => d.Id.ToUpper() == msc.IdDepartment);
                    msc.Customer = context.Customers.FirstOrDefault(d => d.Id.ToUpper() == msc.IdCustomer);

                    return $"{msc.Department} ({msc.Customer.CustomerName})";
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public static object GetApplicationsServerSide(HttpRequestBase request)
        {
            try
            {
                int pageSize = int.Parse(request.Form["length"]);
                int start = int.Parse(request.Form["start"]);
                int draw = int.Parse(request.Form["draw"]);
                string searchValue = request.Form["search[value]"].ToLower();
                var sortColumnDirection = request.Form["order[0][dir]"];

                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    IOrderedQueryable<Entities.MSC> query = context.MSCs;

                    if (sortColumnDirection == "asc")
                    {
                        query = query.OrderBy(m => m.DateCreated);
                    }
                    else
                    {
                        query = query.OrderByDescending(m => m.DateCreated);
                    }

                    if (!string.IsNullOrEmpty(searchValue))
                    {
                        query = (IOrderedQueryable<Entities.MSC>)query.Where(m =>
                                                                             m.Code.ToLower().Contains(searchValue) ||
                                                                             m.Subject.ToLower().Contains(searchValue) ||
                                                                             m.DateCreated.ToString().Contains(searchValue) ||
                                                                             m.IdUserCreated.ToString().Contains(searchValue));
                    }

                    IQueryable<Entities.MSC> dataQuery = query;
                    if (pageSize != -1)
                    {
                        dataQuery = dataQuery.Skip(start).Take(pageSize);
                    }


                    var data = dataQuery.Include(m => m.Signs).ToList()
                                        .Select(m => new
                                        {
                                            Id = m.Id,
                                            Dot = GetDotHtml((int)m.Status),
                                            Code = m.Code,
                                            Date = m.DateCreated?.ToString("yyyy-MM-dd HH:mm:ss"),
                                            UserCreated = GetUserCreated(context.Users.FirstOrDefault(u => u.Id == m.IdUserCreated)),
                                            Subject = m.Subject,
                                            Status = GetStatusHtml((int)m.Status),
                                            Button = GetButtonHtml(m)
                                        })
                                        .ToList();

                    var returnObj = new
                    {
                        draw = draw,
                        recordsTotal = context.MSCs.Count(),
                        recordsFiltered = query.Count(),
                        data = data
                    };

                    return returnObj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /* POST */
        [ValidateInput(false)]
        public static Entities.MSC CreateApplication(HttpRequestBase request)
        {
            try
            {
                var form = request.Form;
                var application = new Entities.MSC();
                int countSigns = form.AllKeys.Where(k => k.StartsWith("Signs")).Count() / 2;

                application.Id = Guid.NewGuid().ToString();
                application.IdUserCreated = form["IdUserCreated"];
                application.DateCreated = DateTime.Parse(form["DateCreated"]);
                application.Subject = form["Subject"];
                application.Process = form["Process"];
                application.Model = form["Model"];
                application.BeforeChange = form["BeforeChange"];
                application.AfterChange = form["AfterChange"];
                application.Reason = form["Reason"];
                application.IdCustomer = form["IdCustomer"];
                application.IdDepartment = form["IdDepartment"];
                application.Code = $"MSC_{application.DateCreated?.ToString("yyyyMMddHHmmss")}";
                application.Status = 1;

                for (int i = 0; i < countSigns; i++)
                {
                    var sign = new SignMSC
                    {
                        IdMSC = application.Id,
                        IdUser = form[$"Signs[{i}].IdUser"],
                        Order = int.Parse(form[$"Signs[{i}].Order"]),
                        Status = 1
                    };

                    application.Signs.Add(sign);
                }

                // Before change file
                if (request.Files["BeforeChangeFile"] != null)
                {
                    var file = request.Files["BeforeChangeFile"];
                    string fileName = $"{Path.GetFileName(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    string path = HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{fileName}");
                    file.SaveAs(path);

                    application.BeforeChangeFile = fileName;
                }

                // After change file
                if (request.Files["AfterChangeFile"] != null)
                {
                    var file = request.Files["AfterChangeFile"];
                    string fileName =  $"{Path.GetFileName(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    string path = HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{fileName}");
                    file.SaveAs(path);

                    application.AfterChangeFile = fileName;
                }

                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    context.MSCs.Add(application);
                    context.SaveChanges();

                    var result = GetApplication(application.Id);

                    var sign = result.Signs.ToArray()[0];
                    sign.User.Email = "you-nan.ruan@mail.foxconn.com";

                    R_Emails.SendSignRequestEmail(result, sign);

                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /* DELETE */
        public static bool DeleteApplication(string IdApplication)
        {
            using (var context = new PcnEntities())
            {
                context.Configuration.LazyLoadingEnabled = false;

                if(context.MSCs.Any(p => p.Id.ToUpper() == IdApplication.ToUpper()))
                {
                    var application = context.MSCs.FirstOrDefault(p => p.Id.ToUpper() == IdApplication.ToUpper());

                    if(application.BeforeChangeFile != null)
                    {
                        string filePath = HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{application.BeforeChangeFile}");
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }
                    if (application.AfterChangeFile != null)
                    {
                        string filePath = HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{application.AfterChangeFile}");
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }

                    context.MSCs.Remove(application);
                    context.SaveChanges();



                    return true;
                }
                else
                {
                    throw new Exception("MSC Application does not exists.");   
                }
            }
        }

        /* Draw */
        private static string GetDotHtml(int status)
        {
            string dotHtml = "";
            switch (status)
            {
                case -1:
                    dotHtml = "<span><i class=\"bi bi-circle-fill fs-6px text-danger\"></i></span>";
                    break;
                case 1:
                    dotHtml = "<span><i class=\"bi bi-circle-fill fs-6px text-warning\"></i></span>";
                    break;
                case 2:
                    dotHtml = "<span><i class=\"bi bi-circle-fill fs-6px text-success\"></i></span>";
                    break;
            }
            return dotHtml;
        }
        private static string GetUserCreated(Entities.User user)
        {
            if (user != null)
                return $"{user.CardId} - {user.VnName ?? user.CnName}";
            else
                return "Unknown";
        }
        private static string GetStatusHtml(int status)
        {
            string statusHtml = "";
            switch (status)
            {
                case -1:
                    statusHtml = "<span class=\"badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px\">Rejected</span>";
                    break;
                case 1:
                    statusHtml = "<span class=\"badge d-block bg-warning text-theme-900 rounded-0 pt-5px w-70px\">Pending</span>";
                    break;
                case 2:
                    statusHtml = "<span class=\"badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px\">Approved</span>";
                    break;
            }
            return statusHtml;
        }
        private static string GetButtonHtml(Entities.MSC msc)
        {           
            var userType = GetSessionUserType(msc);

            var buttons = new
            {
                detailButton = $"<button type=\"button\" data-id=\"{msc.Id}\" onclick=\"DetailMSC(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>",
                updateButton = $"<button type=\"button\" data-id=\"{msc.Id}\" onclick=\"UpdateMSC(this, event)\" title=\"Update\" class=\"btn btn-sm btn-warning\"><i class=\"fa-duotone fa-pen\"></i></button>",
                deleteButton = $"<button type=\"button\" data-id=\"{msc.Id}\" onclick=\"DeleteMSC(this, event)\" title=\"Delete\" class=\"btn btn-sm btn-danger\"><i class=\"fa-duotone fa-trash\"></i></button>",
                rejectButton = $"<button type=\"button\" data-id=\"{msc.Id}\" onclick=\"RejectMSC(this, event)\" title=\"Reject\" class=\"btn btn-sm btn-danger\"><i class=\"fa-duotone fa-x\"></i></button>",
                approveButton = $"<button type=\"button\" data-id=\"{msc.Id}\" onclick=\"ApproveMSC(this, event)\" title=\"Approve\" class=\"btn btn-sm btn-success\"><i class=\"fa-duotone fa-check\"></i></button>",
                IEApproveButton = $"<button type=\"button\" data-id=\"{msc.Id}\" onclick=\"IEApproveMSC(this, event)\" title=\"Approve\" class=\"btn btn-sm btn-success\"><i class=\"fa-duotone fa-check\"></i></button>",
                updateDisableButton = $"<button type=\"button\" title=\"update\" class=\"btn btn-sm btn-secondary disabled\"><i class=\"fa-duotone fa-pen\"></i></button>",
                deleteDisableButton = $"<button type=\"button\" title=\"delete\" class=\"btn btn-sm btn-secondary disabled\"><i class=\"fa-duotone fa-trash\"></i></button>",
            };

            switch (userType)
            {
                case "Guest":
                    return $"<div class=\"btn-group\">{buttons.detailButton}{buttons.updateDisableButton}{buttons.deleteDisableButton}</div>";
                case "OwnerHasSigned":
                    return $"<div class=\"btn-group\">{buttons.detailButton}{buttons.updateDisableButton}{buttons.deleteDisableButton}</div>";
                case "OwnerNotSigned":
                    return $"<div class=\"btn-group\">{buttons.detailButton}{buttons.updateButton}{buttons.deleteButton}</div>";
                case "SignIE":
                    return $"<div class=\"btn-group\">{buttons.detailButton}{buttons.IEApproveButton}{buttons.rejectButton}</div>";
                case "SignNormal":
                    return $"<div class=\"btn-group\">{buttons.detailButton}{buttons.approveButton}{buttons.rejectButton}</div>";
                default:
                    return $"<div class=\"btn-group\">{buttons.detailButton}{buttons.updateDisableButton}{buttons.deleteDisableButton}</div>";
            }
        }
        private static string GetSessionUserType(Entities.MSC msc)
        {
            var sessionUser = Common.GetSessionUser();

            var userType = "Guest";

            try
            {
                // là người tạo đơn
                if (msc.IdUserCreated == sessionUser.Id)
                {
                    // đã có ký
                    if (msc.Signs.Any(s => s.Status != 1))
                    {
                        userType = "OwnerHasSigned";
                    }
                    // chưa có ai ký
                    else
                    {
                        userType = "OwnerNotSigned";
                    }

                }
                else
                {
                    var signUser = R_User.GetUser(msc.Signs.OrderBy(s => s.Order).FirstOrDefault(s => s.Status == 1).IdUser);

                    // tới lượt ký
                    if (!msc.Signs.Any(s => s.Status == -1) && signUser.Id == sessionUser.Id)
                    {
                        // là IE ký
                        if (signUser.UserDepartments.Any(ud => ud.Department.DepartmentName.ToUpper() == "IE"))
                        {
                            userType = "SignIE";
                        }
                        // là ng ký bt
                        else
                        {
                            userType = "SignNormal";
                        }
                    }
                }

                return userType;
            }
            catch
            {
                return userType;
            }
            
        }

    }
}