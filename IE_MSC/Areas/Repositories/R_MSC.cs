using IE_MSC.Areas.Entities;
using IE_MSC.Commons;
using IE_MSC.Models.Entities;
using Newtonsoft.Json.Linq;
using System;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_MSC
    {
        /* GET */
        public static object GetApplication(string IdApplication)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;


                    var msc = context.MSCs.FirstOrDefault(m => m.Id.ToUpper() == IdApplication.ToUpper());

                    msc.UserCreated = context.Users.Include(u => u.UserDepartments)
                                                   .Include(u => u.UserDepartments.Select(d => d.Department.Customer))
                                                   .FirstOrDefault(u => u.Id.ToUpper() == msc.IdUserCreated);

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

                    var mscs = context.MSCs.ToList();
                    foreach (var msc in mscs)
                    {
                        msc.UserCreated = context.Users.Include(u => u.UserDepartments)
                                                   .Include(u => u.UserDepartments.Select(d => d.Department.Customer))
                                                   .FirstOrDefault(u => u.Id.ToUpper() == msc.IdUserCreated);
                    }

                    return mscs;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /* POST */
        public static object CreateApplication(JObject data, HttpFileCollectionBase files, bool IsSendBoss)
        {
            try
            {
                var sss = data["RecommendedDate"].ToString();

                // MSC Data
                var application = new Entities.MSC
                {
                    Id = Guid.NewGuid().ToString(),
                    Code = $"PCN_{DateTime.Now.ToString("yyMMddhhmmssfff")}",
                    IdUserCreated = data["RecommendedBy"].ToString(),
                    DateCreated = DateTime.Parse(data["RecommendedDate"].ToString()),
                    Subject = data["Subject"].ToString(),
                    Process = data["ProcessTitle"].ToString(),
                    Model = data["ModelTitle"].ToString(),
                    BeforeChange = HttpUtility.UrlDecode(data["BeforeChangeDescription"].ToString()),
                    AfterChange = HttpUtility.UrlDecode(data["AfterChangeDescription"].ToString()),
                    Reason = HttpUtility.UrlDecode(data["Reason"].ToString()),
                    Status = 1,
                };

                // MSC Sign Process
                var signs = data["PCNConfirms"];
                foreach (var sign in signs)
                {
                    var signMSC = new SignMSC
                    {
                        IdUser = sign["EmployeeID"].ToString(),
                        IdMSC = application.Id,
                        Order = int.Parse(sign["SortOrder"].ToString()),
                        Status = 1,
                    };

                    application.Signs.Add(signMSC);
                }

                // Before change file
                if (files["beforeChangeFile"] != null)
                {
                    var file = files["beforeChangeFile"];

                    string fileName = Path.GetFileName(file.FileName);
                    string fileExtention = Path.GetExtension(fileName);
                    fileName = $"PCN_{application.Id}_{Guid.NewGuid()}_Before{fileExtention}";
                    string path = HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{fileName}");
                    file.SaveAs(path);

                    application.BeforeChangeFile = fileName;
                }

                // After change file
                if (files["afterChangeFile"] != null)
                {
                    var file = files["afterChangeFile"];

                    string fileName = Path.GetFileName(file.FileName);
                    string fileExtention = Path.GetExtension(fileName);
                    fileName = $"PCN_{application.Id}_{Guid.NewGuid()}_After{fileExtention}";
                    string path = HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{fileName}");
                    file.SaveAs(path);

                    application.AfterChangeFile = fileName;
                }

                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    context.MSCs.Add(application);
                    context.SaveChanges();

                    return GetApplication(application.Id);
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

        // Validation

    }
}