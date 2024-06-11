using IE_MSC.Areas.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace IE_MSC.Areas
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

                    var applications = context.Applications.Select(m => m.Status);

                    var data = new
                    {
                        Approved = applications.Where(p => p == 2).Count(),
                        Pending = applications.Where(p => p == 1).Count(),
                        Rejected = applications.Where(p => p == -1).Count(),
                        Total = applications.Count(),
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
                using (PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var nowDate = DateTime.Now;
                    var endDate = new DateTime(nowDate.Year, nowDate.Month, nowDate.Day + 1);
                    var startDate = endDate.AddDays(-7);

                    var applications = context.Applications.Select(m => new
                    {
                        m.Status,
                        m.DateCreated
                    }).Where(p => p.DateCreated != null && p.DateCreated > startDate && p.DateCreated <= endDate);

                    var data = new
                    {
                        Categories = new List<string>(),
                        Approved = new List<int>(),
                        Pending = new List<int>(),
                        Rejected = new List<int>(),
                        Total = new List<int>(),
                    };

                    for (int i = 0; i < 7; i++)
                    {
                        var currentDate = startDate.AddDays(i);
                        var nextDate = currentDate.AddDays(1);

                        data.Categories.Add(currentDate.ToString("yyyy-MM-dd"));

                        var currentApplications = applications.Where(m => m.DateCreated >= currentDate && m.DateCreated < nextDate).ToList();

                        data.Approved.Add(currentApplications.Where(m => m.Status == 2).Count());
                        data.Pending.Add(currentApplications.Where(m => m.Status == 1).Count());
                        data.Rejected.Add(currentApplications.Where(m => m.Status == -1).Count());
                        data.Total.Add(currentApplications.Count());
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

                    var applications = context.Applications.Select(m => new
                    {
                        m.Status,
                        m.IdCustomer,
                    }).ToList();

                    List<object> listDataCustomer = new List<object>();
                    foreach (var customer in context.Customers.ToList())
                    {
                        object data = new
                        {
                            Customer = customer.CustomerName,
                            Pending = applications.Count(p => p.Status == 1 && p.IdCustomer.ToUpper() == customer.Id.ToUpper()),
                            Approved = applications.Count(p => p.Status == 2 && p.IdCustomer.ToUpper() == customer.Id.ToUpper()),
                            Rejected = applications.Count(p => p.Status == -1 && p.IdCustomer.ToUpper() == customer.Id.ToUpper()),
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
        public static object GetMonthOfYearData()
        {
            try
            {
                using (PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    DateTime thresholdDate = DateTime.Now.AddMonths(-12);
                    thresholdDate = new DateTime(thresholdDate.Year, thresholdDate.Month, 1);

                    var applications = context.Applications.Select(m => new
                    {
                        m.DateCreated,
                        m.Status,
                    }).Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= thresholdDate);

                    var data = new
                    {
                        Date = new List<string>(),
                        Pending = new List<int>(),
                        Approved = new List<int>(),
                        Rejected = new List<int>(),
                        Total = new List<int>(),
                    };

                    for (int i = 1; i < 13; i++)
                    {
                        DateTime StartDate = thresholdDate.AddMonths(i);
                        StartDate = new DateTime(StartDate.Year, StartDate.Month, 1);

                        DateTime EndDate = thresholdDate.AddMonths(i + 1);
                        EndDate = new DateTime(EndDate.Year, EndDate.Month, 1);

                        var currentApplications = applications.Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= StartDate && p.DateCreated.Value <= EndDate).ToList();

                        data.Date.Add(StartDate.ToString("yyyy-MMM"));
                        data.Pending.Add(currentApplications.Where(p => p.Status == 1).Count());
                        data.Approved.Add(currentApplications.Where(p => p.Status == 2).Count());
                        data.Rejected.Add(currentApplications.Where(p => p.Status == -1).Count());
                        data.Total.Add(currentApplications.Count());
                    }

                    return data;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetMonthOfYearDataByDepartment()
        {
            try
            {
                using (PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var data = new
                    {
                        Categories = new string[12],
                        Series = new List<Serie>(),
                    };

                    DateTime thresholdDate = DateTime.Now.AddMonths(-12);
                    thresholdDate = new DateTime(thresholdDate.Year, thresholdDate.Month, 1);

                    var departments = context.Departments
                        .Select(d => new
                        {
                            d.Id,
                            d.DepartmentName,
                            d.Customer.CustomerName
                        }).ToList();

                    var applications = context.Applications.Select(m => new
                    {
                        m.DateCreated,
                        m.IdDepartment,
                    }).Where(p => p.DateCreated.HasValue && p.DateCreated.Value >= thresholdDate);


                    if (departments.Count > 0)
                    {
                        foreach (var department in departments)
                        {
                            var serie = new Serie();
                            serie.name = $"{department.DepartmentName} ({department.CustomerName})";
                            serie.data = new List<int>();

                            var currentDepartments = applications.Where(p => p.IdDepartment.ToUpper() == department.Id.ToUpper()).ToList();

                            if (currentDepartments.Count > 0)
                            {
                                for (int i = 1; i < 13; i++)
                                {
                                    DateTime StartDate = thresholdDate.AddMonths(i);
                                    StartDate = new DateTime(StartDate.Year, StartDate.Month, 1);

                                    DateTime EndDate = thresholdDate.AddMonths(i + 1);
                                    EndDate = new DateTime(EndDate.Year, EndDate.Month, 1);

                                    var currentApplications = currentDepartments.Count(p => p.DateCreated.HasValue && p.DateCreated.Value >= StartDate && p.DateCreated.Value <= EndDate);

                                    serie.data.Add(currentApplications);

                                    if (string.IsNullOrEmpty(data.Categories[i - 1]))
                                    {
                                        data.Categories[i - 1] = StartDate.ToString("yyyy-MMM");
                                    }
                                }

                                data.Series.Add(serie);
                            }
                        }

                        return data;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetTop10()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    var result = dbContext.Applications.OrderByDescending(p => p.DateCreated).Take(10).ToList();


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
                using (PcnEntities context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var pcnsQuery = context.Applications
                        .OrderByDescending(p => p.DateCreated)
                        .Take(10)
                        .Select(p => new
                        {
                            p.Id,
                            p.Code,
                            p.Signs.FirstOrDefault().Status,
                            Date = p.DateCreated,
                            User = context.Users.FirstOrDefault(e => e.Id.ToUpper() == p.IdUserCreated.ToUpper()),
                        });
                    var confirmsQuery = context.Signs
                        .OrderByDescending(p => p.DateApproved)
                        .OrderByDescending(p => p.DateRejected)
                        .Take(10)
                        .Select(c => new
                        {
                            Id = context.Applications.FirstOrDefault(m => m.Id.ToUpper() == c.IdApplication.ToUpper()).Id,
                            Code = context.Applications.FirstOrDefault(m => m.Id.ToUpper() == c.IdApplication.ToUpper()).Code,
                            c.Status,
                            Date = c.DateApproved != null ? c.DateApproved : c.DateRejected != null ? c.DateRejected : null,
                            User = context.Users.FirstOrDefault(u => u.Id == c.IdUser)
                        });

                    var combinedQuery = pcnsQuery.Concat(confirmsQuery).OrderByDescending(p => p.Date).Take(10).ToList();

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
        public List<int> data { get; set; }
    }
}