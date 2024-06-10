using IE_MSC.Areas.Entities;
using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.IO;
using System.Linq;
using System.Web;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_PCN
    {
        /* GET */
        public static Entities.Application GetApplication(string IdApplication)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;


                    var application = context.Applications
                        .Include(m => m.Signs)
                        .Include(m => m.Signs.Select(s => s.User.UserDepartments.Select(ud => ud.Department.Customer)))
                        .FirstOrDefault(m => m.Id.ToUpper() == IdApplication.ToUpper());

                    application.UserCreated = context.Users
                        .Include(u => u.UserDepartments
                        .Select(d => d.Department.Customer))
                        .FirstOrDefault(u => u.Id.ToUpper() == application.IdUserCreated);

                    application.Customer = context.Customers
                        .FirstOrDefault(c => c.Id.ToUpper() == application.IdCustomer.ToUpper());
                    application.Department = context.Departments
                        .FirstOrDefault(d => d.Id.ToUpper() == application.IdDepartment.ToUpper());

                    application.Signs = application.Signs.OrderBy(s => s.Order).ToList();
                    foreach (var sign in application.Signs)
                    {
                        sign.Customer = context.Customers
                            .FirstOrDefault(c => c.Id.ToUpper() == sign.IdCustomer.ToUpper());
                        sign.Department = context.Departments
                            .FirstOrDefault(d => d.Id.ToUpper() == sign.IdDepartment.ToUpper());
                    }


                    return application;
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

                    var applications = context.Applications.Select(m => new
                    {
                        m.Id,
                        m.Code,
                        m.Subject,
                        m.Status,
                        m.IdUserCreated,
                        UserCreated = context.Users.FirstOrDefault(u => u.Id.ToUpper() == m.IdUserCreated),
                    }).ToList();

                    return applications;
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


                    var application = context.Applications.FirstOrDefault(m => m.Id.ToUpper() == IdApplication.ToUpper());

                    application.Department = context.Departments.FirstOrDefault(d => d.Id.ToUpper() == application.IdDepartment);
                    application.Customer = context.Customers.FirstOrDefault(d => d.Id.ToUpper() == application.IdCustomer);

                    return $"{application.Department} ({application.Customer.CustomerName})";
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

                    IQueryable<Entities.Application> query = context.Applications.Include(app => app.Signs);

                    // Sorting
                    if (sortColumnDirection == "asc") query = query.OrderBy(m => m.DateCreated);
                    else query = query.OrderByDescending(m => m.DateCreated);

                    // Total count before paging
                    int recordsTotal = query.Count();

                    // Load required columns into memory
                    var rawData = query.ToList();

                    // Applying custom methods after data is loaded into memory
                    var data = rawData.Select(app => new
                    {
                        Id = app.Id,
                        Dot = GetDotHtml((int)app.Status),
                        Code = app.Code,
                        Date = GetDate((DateTime)app.DateCreated),
                        UserCreated = GetUserCreated(context, app.IdUserCreated),
                        Subject = app.Subject,
                        Status = GetStatusHtml((int)app.Status),
                        Button = GetButtonHtml(app, false, false)
                    }).ToList();

                    // Advanced search
                    if (!string.IsNullOrEmpty(searchValue))
                    {
                        data = data.Where(app => app.Code.ToLower().Contains(searchValue) ||
                                                 app.Subject.ToLower().Contains(searchValue) ||
                                                 app.Date.Contains(searchValue) ||
                                                 app.UserCreated.ToLower().Contains(searchValue) ||
                                                 app.Status.ToLower().Contains(searchValue) ||
                                                 app.Date.ToLower().Contains(searchValue)).ToList();
                    }

                    // Count filtered records
                    int recordsFiltered = data.Count();

                    // Apply paging after advanced search
                    var pagedData = data.Skip(start).Take(pageSize).ToList();

                    var returnObj = new
                    {
                        draw,
                        recordsTotal,
                        recordsFiltered,
                        data = pagedData
                    };

                    return returnObj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetSessionUserApplicationsServerSide(HttpRequestBase request)
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

                    var sessionUser = Common.GetSessionUser();

                    IQueryable<Entities.Application> query = context.Applications.Include(app => app.Signs).Where(app => app.IdUserCreated == sessionUser.Id);

                    // Sorting
                    if (sortColumnDirection == "asc") query = query.OrderBy(m => m.DateCreated);
                    else query = query.OrderByDescending(m => m.DateCreated);

                    // Total count before paging
                    int recordsTotal = query.Count();

                    // Load required columns into memory
                    var rawData = query.ToList();

                    // Applying custom methods after data is loaded into memory
                    var data = rawData.Select(app => new
                    {
                        Id = app.Id,
                        Dot = GetDotHtml((int)app.Status),
                        Code = app.Code,
                        Date = GetDate((DateTime)app.DateCreated),
                        UserCreated = GetUserCreated(context, app.IdUserCreated),
                        Subject = app.Subject,
                        Status = GetStatusHtml((int)app.Status),
                        Button = GetButtonHtml(app, true, false)
                    }).ToList();

                    // Advanced search
                    if (!string.IsNullOrEmpty(searchValue))
                    {
                        data = data.Where(app => app.Code.ToLower().Contains(searchValue) ||
                                                 app.Subject.ToLower().Contains(searchValue) ||
                                                 app.Date.Contains(searchValue) ||
                                                 app.UserCreated.ToLower().Contains(searchValue) ||
                                                 app.Status.ToLower().Contains(searchValue) ||
                                                 app.Date.ToLower().Contains(searchValue)).ToList();
                    }

                    // Count filtered records
                    int recordsFiltered = data.Count();

                    // Apply paging after advanced search
                    var pagedData = data.Skip(start).Take(pageSize).ToList();

                    var returnObj = new
                    {
                        draw,
                        recordsTotal,
                        recordsFiltered,
                        data = pagedData
                    };

                    return returnObj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetSessionUserSignApplicationsServerSide(HttpRequestBase request)
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

                    var sessionUser = Common.GetSessionUser();

                    IQueryable<Entities.Application> query = context.Applications
                        .Include(app => app.Signs)
                        .Where(app => app.Signs.Any(s => s.IdUser == sessionUser.Id));

                    // Sorting
                    if (sortColumnDirection == "asc") query = query.OrderBy(m => m.DateCreated);
                    else query = query.OrderByDescending(m => m.DateCreated);

                    // Total count before paging
                    int recordsTotal = query.Count();

                    // Load required columns into memory
                    var rawData = query.ToList();

                    // Applying custom methods after data is loaded into memory
                    var data = rawData.Select(app => new
                    {
                        Id = app.Id,
                        Dot = GetDotHtml((int)app.Status),
                        Code = app.Code,
                        Date = GetDate((DateTime)app.DateCreated),
                        UserCreated = GetUserCreated(context, app.IdUserCreated),
                        Subject = app.Subject,
                        Status = GetStatusHtml((int)app.Status),
                        SignStatus = GetSignStatusHtml(app),
                        Button = GetButtonHtml(app, false, true)
                    }).ToList();

                    // Advanced search
                    if (!string.IsNullOrEmpty(searchValue))
                    {
                        data = data.Where(app => app.Code.ToLower().Contains(searchValue) ||
                                                 app.Subject.ToLower().Contains(searchValue) ||
                                                 app.Date.Contains(searchValue) ||
                                                 app.UserCreated.ToLower().Contains(searchValue) ||
                                                 app.Status.ToLower().Contains(searchValue) ||
                                                 app.Date.ToLower().Contains(searchValue)).ToList();
                    }

                    // Count filtered records
                    int recordsFiltered = data.Count();

                    // Apply paging after advanced search
                    var pagedData = data.Skip(start).Take(pageSize).ToList();

                    var returnObj = new
                    {
                        draw,
                        recordsTotal,
                        recordsFiltered,
                        data = pagedData
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
        public static Entities.Application CreateApplication(HttpRequestBase request)
        {
            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var application = MapCreateApplication(request);

                    // Save to DB
                    context.Applications.Add(application);
                    context.SaveChanges();
                    transaction.Commit();

                    var result = GetApplication(application.Id);

                    // Send Email
                    var sign = result.Signs.ToArray()[0];
                    sign.User.Email = "you-nan.ruan@mail.foxconn.com";

                    var IsSendBoss = bool.Parse(request.Form["IsSendBoss"]);
                    R_Emails.SendSignRequestEmail(result, sign, IsSendBoss);

                    // Return
                    return result;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }

            }
        }
        public static Entities.Application UpdateApplication(HttpRequestBase request)
        {
            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;
                    var form = request.Form;

                    var IdApplication = form["Id"].ToUpper();
                    var oldApplication = context.Applications.FirstOrDefault(app => app.Id.ToUpper() == IdApplication);

                    if (oldApplication != null)
                    {
                        var newApplication = MapUpdateApplication(request, oldApplication);

                        context.Applications.Remove(oldApplication);
                        context.Applications.Add(newApplication);

                        context.SaveChanges();
                        transaction.Commit();

                        return GetApplication(newApplication.Id);
                    }
                    else
                    {
                        throw new Exception("Application does not exists.");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }

            }
        }

        // Map
        private static Entities.Application MapCreateApplication(HttpRequestBase request)
        {
            var form = request.Form;

            var application = new Entities.Application
            {
                Id = Guid.NewGuid().ToString(),
                IdUserCreated = form["IdUserCreated"],
                DateCreated = DateTime.Parse(form["DateCreated"]),
                Subject = form["Subject"],
                Process = form["Process"],
                Model = form["Model"],
                BeforeChange = form["BeforeChange"],
                AfterChange = form["AfterChange"],
                Reason = form["Reason"],
                CalcCost = form["CalcCost"],
                IdCustomer = form["IdCustomer"],
                IdDepartment = form["IdDepartment"],
                Code = $"PCN_{DateTime.Parse(form["DateCreated"]).ToString("yyyyMMddHHmmss")}",
                Status = 1,
            };

            int countSigns = form.AllKeys.Where(k => k.StartsWith("Signs")).Count() / 4;
            for (int i = 0; i < countSigns; i++)
            {
                var signApplication = new Sign
                {
                    IdApplication = application.Id,
                    IdCustomer = form[$"Signs[{i}].IdCustomer"],
                    IdDepartment = form[$"Signs[{i}].IdDepartment"],
                    IdUser = form[$"Signs[{i}].IdUser"],
                    Order = int.Parse(form[$"Signs[{i}].Order"]),
                    Status = 1
                };

                application.Signs.Add(signApplication);
            }

            // Before change file
            if (request.Files["BeforeChangeFile"] != null)
            {
                var file = request.Files["BeforeChangeFile"];
                string fileName = $"{Path.GetFileName(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string path = HttpContext.Current.Server.MapPath($"/Data/Files/{fileName}");
                file.SaveAs(path);

                application.BeforeChangeFile = fileName;
            }

            // After change file
            if (request.Files["AfterChangeFile"] != null)
            {
                var file = request.Files["AfterChangeFile"];
                string fileName = $"{Path.GetFileName(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string path = HttpContext.Current.Server.MapPath($"/Data/Files/{fileName}");
                file.SaveAs(path);

                application.AfterChangeFile = fileName;
            }

            return application;
        }
        private static Entities.Application MapUpdateApplication(HttpRequestBase request, Entities.Application oldApplication)
        {
            var form = request.Form;

            var application = new Entities.Application
            {
                Id = oldApplication.Id,
                IdUserCreated = oldApplication.IdUserCreated,
                DateCreated = oldApplication.DateCreated,
                Subject = form["Subject"],
                Process = form["Process"],
                Model = form["Model"],
                BeforeChange = form["BeforeChange"],
                AfterChange = form["AfterChange"],
                Reason = form["Reason"],
                CalcCost = form["CalcCost"],
                IdCustomer = form["IdCustomer"],
                IdDepartment = form["IdDepartment"],
                Code = oldApplication.Code,
                Status = 1,
            };

            int countSigns = form.AllKeys.Where(k => k.StartsWith("Signs")).Count() / 4;
            for (int i = 0; i < countSigns; i++)
            {
                var signApplication = new Sign
                {
                    IdApplication = application.Id,
                    IdCustomer = form[$"Signs[{i}].IdCustomer"],
                    IdDepartment = form[$"Signs[{i}].IdDepartment"],
                    IdUser = form[$"Signs[{i}].IdUser"],
                    Order = int.Parse(form[$"Signs[{i}].Order"]),
                    Status = 1
                };

                application.Signs.Add(signApplication);
            }

            // Before change file
            if (request.Files["BeforeChangeFile"] != null)
            {
                // Xoá file cũ lưu file mới
                if (File.Exists(HttpContext.Current.Server.MapPath($"/Data/Files/{oldApplication.BeforeChangeFile}")))
                {
                    File.Delete(HttpContext.Current.Server.MapPath($"/Data/Files/{oldApplication.BeforeChangeFile}"));
                }

                var file = request.Files["BeforeChangeFile"];
                string fileName = $"{Path.GetFileName(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string path = HttpContext.Current.Server.MapPath($"/Data/Files/{fileName}");
                file.SaveAs(path);

                application.BeforeChangeFile = fileName;
            }
            else
            {
                application.BeforeChangeFile = oldApplication.BeforeChangeFile;
            }

            // After change file
            if (request.Files["AfterChangeFile"] != null)
            {
                // Xoá file cũ lưu file mới
                if (File.Exists(HttpContext.Current.Server.MapPath($"/Data/Files/{oldApplication.AfterChangeFile}")))
                {
                    File.Delete(HttpContext.Current.Server.MapPath($"/Data/Files/{oldApplication.AfterChangeFile}"));
                }

                var file = request.Files["AfterChangeFile"];
                string fileName = $"{Path.GetFileName(file.FileName)}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                string path = HttpContext.Current.Server.MapPath($"/Data/Files/{fileName}");
                file.SaveAs(path);

                application.AfterChangeFile = fileName;
            }
            else
            {
                application.AfterChangeFile = oldApplication.AfterChangeFile;
            }

            return application;
        }

        // Approve + Reject
        public static Entities.Application ApproveApplication(Sign sign, string calcCost)
        {
            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var application = context.Applications.Include(app => app.Signs).FirstOrDefault(app => app.Id == sign.IdApplication);
                    var dbSing = application.Signs.FirstOrDefault(s => s.IdUser == sign.IdUser && s.IdApplication == sign.IdApplication);

                    if (application != null && dbSing != null)
                    {
                        if (!string.IsNullOrEmpty(calcCost)) application.CalcCost = calcCost;
                        if (!string.IsNullOrEmpty(sign.Detail)) dbSing.Detail = sign.Detail;

                        dbSing.Status = 2; // Approve = 2
                        dbSing.DateApproved = DateTime.Now;

                        context.Applications.AddOrUpdate(application);
                        context.Signs.AddOrUpdate(dbSing);

                        if (!application.Signs.Any(s => s.Status != 2)) application.Status = 2;

                        context.SaveChanges();
                        transaction.Commit();

                        return GetApplication(application.Id);
                    }
                    else
                    {
                        throw new Exception("Application does not exists.");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
        }
        public static Entities.Application RejectApplication(Sign sign, string calcCost)
        {
            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var application = context.Applications.Include(app => app.Signs).FirstOrDefault(app => app.Id == sign.IdApplication);
                    var dbSing = application.Signs.FirstOrDefault(s => s.IdUser == sign.IdUser && s.IdApplication == sign.IdApplication);

                    if (application != null && dbSing != null)
                    {
                        if (!string.IsNullOrEmpty(calcCost)) application.CalcCost = calcCost;
                        if (!string.IsNullOrEmpty(sign.Detail)) dbSing.Detail = sign.Detail;

                        dbSing.Status = -1; // Reject = -1
                        dbSing.DateRejected = DateTime.Now;
                        application.Status = -1;

                        context.Applications.AddOrUpdate(application);
                        context.Signs.AddOrUpdate(dbSing);
                        context.SaveChanges();
                        transaction.Commit();

                        return GetApplication(application.Id);
                    }
                    else
                    {
                        throw new Exception("Application does not exists.");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
        }

        /* DELETE */
        public static bool DeleteApplication(string IdApplication)
        {
            using (var context = new PcnEntities())
            {
                context.Configuration.LazyLoadingEnabled = false;

                if (context.Applications.Any(p => p.Id.ToUpper() == IdApplication.ToUpper()))
                {
                    var application = context.Applications.FirstOrDefault(p => p.Id.ToUpper() == IdApplication.ToUpper());

                    if (application.BeforeChangeFile != null)
                    {
                        string filePath = HttpContext.Current.Server.MapPath($"/Data/Files/{application.BeforeChangeFile}");
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }
                    if (application.AfterChangeFile != null)
                    {
                        string filePath = HttpContext.Current.Server.MapPath($"/Data/Files/{application.AfterChangeFile}");
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                    }

                    context.Applications.Remove(application);
                    context.SaveChanges();



                    return true;
                }
                else
                {
                    throw new Exception("Application does not exists.");
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
        private static string GetDate(DateTime date)
        {
            return date.ToString("yyyy-MM-dd HH:mm");
        }
        private static string GetUserCreated(PcnEntities context, string IdUser)
        {
            var user = context.Users.FirstOrDefault(u => u.Id == IdUser);
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
        private static string GetSignStatusHtml(Entities.Application application)
        {
            string statusHtml = "";
            var sessionUser = Common.GetSessionUser();

            bool isRejected = application.Signs.Any(s => s.Status == -1);
            if (isRejected)
            {
                foreach (var sign in application.Signs)
                {
                    if (sign.Status == 1) sign.Status = 3;
                }
            }

            switch (application.Signs.FirstOrDefault(s => s.IdUser == sessionUser.Id).Status)
            {
                case -1:
                    statusHtml = "<span class=\"badge d-block bg-danger text-theme-900 rounded-0 pt-5px w-70px\">Rejected</span>";
                    break;
                case 1:
                    statusHtml = "<span class=\"badge d-block bg-warning text-theme-900 rounded-0 pt-5px w-70px\">Waiting</span>";
                    break;
                case 2:
                    statusHtml = "<span class=\"badge d-block bg-success text-theme-900 rounded-0 pt-5px w-70px\">Approved</span>";
                    break;
                case 3:
                    statusHtml = "<span class=\"badge d-block bg-secondary text-theme-900 rounded-0 pt-5px w-70px\">Closed</span>";
                    break;
            }

            return statusHtml;
        }
        private static string GetButtonHtml(Entities.Application application, bool IsSessionUser, bool IsSessionUserSign)
        {
            if (!IsSessionUser && !IsSessionUserSign)
            {
                return $"<div class=\"btn-group\">" +
                       $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Detail(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>" +
                       $"</div>";
            }
            else if (IsSessionUser)
            {
                if (application.Signs.Any(s => s.Status != 1))
                {
                    return $"<div class=\"btn-group\">" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Detail(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>" +
                           $"   <button type=\"button\" title=\"Update\" class=\"disabled btn btn-sm btn-secondary\"><i class=\"fa-duotone fa-pen\"></i></button>" +
                           $"   <button type=\"button\" title=\"Delete\" class=\"disabled btn btn-sm btn-secondary\"><i class=\"fa-duotone fa-trash\"></i></button>" +
                           $"</div>";
                }
                else
                {
                    return $"<div class=\"btn-group\">" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Detail(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Update(this, event)\" title=\"Update\" class=\"btn btn-sm btn-warning\"><i class=\"fa-duotone fa-pen\"></i></button>" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Delete(this, event)\" title=\"Delete\" class=\"btn btn-sm btn-danger\"><i class=\"fa-duotone fa-trash\"></i></button>" +
                           $"</div>";
                }

            }
            else if (IsSessionUserSign)
            {
                var sessionUser = Common.GetSessionUser();
                if (application.Signs.Any(s => s.IdUser == sessionUser.Id && s.Status != 1))
                {
                    return $"<div class=\"btn-group\">" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Detail(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>" +
                           $"</div>";
                }
                else
                {
                    return $"<div class=\"btn-group\">" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Detail(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Approve(this, event)\" title=\"Approve\" class=\"btn btn-sm btn-success\"><i class=\"fa-duotone fa-check\"></i></button>" +
                           $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Reject(this, event)\" title=\"Reject\" class=\"btn btn-sm btn-danger\"><i class=\"fa-duotone fa-x\"></i></button>" +
                           $"</div>";
                }
            }
            else
            {
                return $"<div class=\"btn-group\">" +
                       $"   <button type=\"button\" data-id=\"{application.Id}\" onclick=\"Detail(this, event)\" title=\"Detail\" class=\"btn btn-sm btn-primary\"><i class=\"fa-duotone fa-info\"></i></button>" +
                       $"</div>";
            }
        }


    }
}