using IE_MSC.Areas.Entities;
using IE_MSC.Models.Entities;
using IE_MSC.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_Dashboard
    {
        // GET
        public static object GetHeaderData()
        {
            try
            {
                using (PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var mscs = context.MSCs.ToList();

                    var data = new
                    {
                        Approved = mscs.Where(p => p.Status == 2).Count(),
                        Pending = mscs.Where(p => p.Status == 1).Count(),
                        Rejected = mscs.Where(p => p.Status == -1).Count(),
                        Total = mscs.Count(),
                    };

                    return data;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetWeekData()
        {
            try
            {
                using(PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var nowDate = DateTime.Now;
                    var endDate = new DateTime(nowDate.Year, nowDate.Month, nowDate.Day);
                    var startDate = endDate.AddDays(-7);

                    var pcns = context.MSCs.Where(p => p.DateCreated != null && p.DateCreated > startDate && p.DateCreated <= endDate)
                                                .OrderBy(p => p.DateCreated)
                                                .ToList();

                    var data = new
                    {
                        Categories = new List<string>(),
                        Approved = new List<int>(),
                        Pending = new List<int>(),
                        Rejected = new List<int>(),
                        Total = new List<int>(),
                    };

                    for(int i = 1; i < 8; i++)
                    {
                        var currentDate = startDate.AddDays(i);

                        data.Categories.Add(currentDate.ToString("yyyy-MM-dd"));
                        data.Approved.Add(0);
                        data.Pending.Add(0);
                        data.Rejected.Add(0);
                        data.Total.Add(0);
                    }

                    foreach (var pcn in pcns)
                    {
                        if(pcn.DateCreated != null)
                        {
                            var categorie = data.Categories.FirstOrDefault(d => d == pcn.DateCreated?.ToString("yyyy-MM-dd"));
                            if (categorie != null)
                            {
                                var index = data.Categories.IndexOf(categorie);
                                switch (pcn.Status ?? 0)
                                {
                                    case -1:
                                        data.Rejected[index] += 1;
                                        break;
                                    case 1:
                                        data.Pending[index] += 1;
                                        break;
                                    case 2:
                                        data.Approved[index] += 1;
                                        break;
                                }
                                data.Total[index] += 1;
                            }
                        }
                    }


                    return data;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }  
        public static object GetDataByCustomer()
        {
            try
            {
                using (PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    List<object> listDataCustomer = new List<object>();
                    foreach (var customer in context.Customers.ToList())
                    {
                        object data = new
                        {
                            Customer = customer.CustomerName,
                            Pending = context.MSCs.Count(p => p.Status == 1 && context.Users.Any(u => u.Id == p.IdUserCreated && u.UserDepartments.Any(ud => ud.Department.IdCustomer == customer.Id))),
                            Rejected = context.MSCs.Count(p => p.Status == -1 && context.Users.Any(e => e.Id == p.IdUserCreated && e.UserDepartments.Any(ud => ud.Department.IdCustomer == customer.Id))),
                            Approved = context.MSCs.Count(p => p.Status == 2 && context.Users.Any(e => e.Id == p.IdUserCreated && e.UserDepartments.Any(ud => ud.Department.IdCustomer == customer.Id))),
                        };

                        listDataCustomer.Add(data);
                    }

                    

                    return listDataCustomer;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetPcnMonthOfYearData()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    DateTime thresholdDate = DateTime.Now.AddMonths(-12);
                    thresholdDate = new DateTime(thresholdDate.Year, thresholdDate.Month, 1);

                    var pcns = dbContext.MSCs.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= thresholdDate);

                    var data = new
                    {
                        Date = new List<string>(),
                        Approved = new List<int>(),
                        Pending = new List<int>(),
                        Rejected = new List<int>(),
                        Total = new List<int>(),
                    };

                    for(int i = 1; i < 13; i++)
                    {
                        DateTime StartDate = thresholdDate.AddMonths(i);
                        StartDate = new DateTime(StartDate.Year, StartDate.Month, 1);

                        DateTime EndDate = thresholdDate.AddMonths(i + 1);
                        EndDate = new DateTime(EndDate.Year, EndDate.Month, 1);

                        data.Date.Add(StartDate.ToString("yyyy-MMM"));
                        data.Approved.Add(pcns.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= StartDate && p.DateCreated.Value <= EndDate && p.Status == 2).Count());
                        data.Pending.Add(pcns.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= StartDate && p.DateCreated.Value <= EndDate && p.Status == 1).Count());
                        data.Rejected.Add(pcns.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= StartDate && p.DateCreated.Value <= EndDate && p.Status == -1).Count());
                        data.Total.Add(pcns.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= StartDate && p.DateCreated.Value <= EndDate).Count());

                    }

                    return data;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetPcnMonthOfYearDataByDepartment()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    var data = new
                    {
                        Categories = new List<string>(),
                        IdDepartments = new List<string>(),
                        Series = new List<Serie>(),

                    };

                    foreach (var dept in dbContext.Departments.Include(d => d.Customer).ToList())
                    {

                        var deptCount = dbContext.MSCs.Count(p => p.Status == 1 && 
                                                                dbContext.Users.Any(e => e.Id == p.IdUserCreated && 
                                                                e.UserDepartments.FirstOrDefault().Department.Id == dept.Id));
                        if(deptCount > 0)
                        {
                            data.IdDepartments.Add(dept.Id);
                            data.Series.Add(new Serie
                            {
                                name = $"{dept.DepartmentName} ({dept.Customer.CustomerName})",
                                data = new List<object>(),
                            });
                        }
                    }

                    DateTime thresholdDate = DateTime.Now.AddMonths(-12);
                    thresholdDate = new DateTime(thresholdDate.Year, thresholdDate.Month, 1);

                    var pcns = dbContext.MSCs.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= thresholdDate);

                    for (int i = 1; i < 13; i++)
                    {
                        DateTime StartDate = thresholdDate.AddMonths(i);
                        StartDate = new DateTime(StartDate.Year, StartDate.Month, 1);

                        DateTime EndDate = thresholdDate.AddMonths(i + 1);
                        EndDate = new DateTime(EndDate.Year, EndDate.Month, 1);

                        data.Categories.Add(StartDate.ToString("yyyy-MMM"));

                        foreach(var IdDept in data.IdDepartments)
                        {
                            int deptCount = pcns.Where(p => p.DateCreated.HasValue &&
                                                            p.DateCreated.Value >= StartDate &&
                                                            p.DateCreated.Value <= EndDate &&
                                                            dbContext.Users.Any(e => e.Id == p.IdUserCreated &&
                                                            e.UserDepartments.FirstOrDefault().Department.Id == IdDept)).Count();

                            int indexOf = data.IdDepartments.IndexOf(IdDept);
                            data.Series[indexOf].data.Add(deptCount);
                        }

                    }

                    return data;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetTop10Pcn()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    var result = dbContext.MSCs.OrderByDescending(p => p.DateCreated).Take(10).ToList();


                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetTop10Action()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    var pcnsQuery = dbContext.MSCs
                                             .OrderByDescending(p => p.DateCreated)
                                             .Take(50)
                                             .Select(p => new
                                             {
                                                 p.Id,
                                                 p.Code,
                                                 p.Signs.FirstOrDefault().Status,
                                                 Date = p.DateCreated,
                                                 User = dbContext.Users.FirstOrDefault(e => e.Id == p.IdUserCreated),
                                             });
                    var confirmsQuery = dbContext.MSCs
                                                 .OrderByDescending(p => p.DateCreated)
                                                 .Take(50)
                                                 .Select(c => new
                                                 {
                                                     c.Id,
                                                     c.Code,
                                                     c.Status,
                                                     Date = c.DateCreated,
                                                     User = dbContext.Users.FirstOrDefault(u => u.Id == c.IdUserCreated)
                                                 });

                    var combinedQuery = pcnsQuery.Concat(confirmsQuery)
                                                .OrderByDescending(p => p.Date)
                                                .Take(10)
                                                .ToList();
                   
                    return combinedQuery;
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
    public class Serie
    {
        public string name { get; set; }
        public List<object> data { get; set; }
    }
}