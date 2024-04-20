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
        public static object GetPcnData()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    var pcns = dbContext.PCN_Set.ToList();

                    var data = new
                    {
                        Approved = pcns.Where(p => p.Status == 2).Count(),
                        Pending = pcns.Where(p => p.Status == 1).Count(),
                        Rejected = pcns.Where(p => p.Status == -1).Count(),
                        Total = pcns.Count(),
                    };

                    return data;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetPcnWeekData()
        {
            try
            {
                using(PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    var nowDate = DateTime.Now;
                    var endDate = new DateTime(nowDate.Year, nowDate.Month, nowDate.Day);
                    var startDate = endDate.AddDays(-7);

                    var pcns = dbContext.PCN_Set.Where(p => p.CreatedDate != null && p.CreatedDate > startDate && p.CreatedDate <= endDate)
                                                .OrderBy(p => p.CreatedDate)
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
                        if(pcn.CreatedDate != null)
                        {
                            var categorie = data.Categories.FirstOrDefault(d => d == pcn.CreatedDate?.ToString("yyyy-MM-dd"));
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
        public static object GetPcnDataByCustomer()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {
                    dbContext.Configuration.LazyLoadingEnabled = false;

                    List<object> listDataCustomer = new List<object>();
                    foreach (var customer in dbContext.Customer_Set.ToList())
                    {
                        object data = new
                        {
                            Customer = customer.CustomerName,
                            Pending = dbContext.PCN_Set.Count(p => p.Status == 1 && dbContext.Employee_Set.Any(e => e.EmployeeID == p.CreatedBy && e.DepartmentEmployees.FirstOrDefault().Department.CustomerID == customer.CustomerID)),
                            Rejected = dbContext.PCN_Set.Count(p => p.Status == -1 && dbContext.Employee_Set.Any(e => e.EmployeeID == p.CreatedBy && e.DepartmentEmployees.FirstOrDefault().Department.CustomerID == customer.CustomerID)),
                            Approved = dbContext.PCN_Set.Count(p => p.Status == 2 && dbContext.Employee_Set.Any(e => e.EmployeeID == p.CreatedBy && e.DepartmentEmployees.FirstOrDefault().Department.CustomerID == customer.CustomerID)),
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

                    var pcns = dbContext.PCN_Set.Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= thresholdDate);

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
                        data.Approved.Add(pcns.Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= StartDate && p.CreatedDate.Value <= EndDate && p.Status == 2).Count());
                        data.Pending.Add(pcns.Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= StartDate && p.CreatedDate.Value <= EndDate && p.Status == 1).Count());
                        data.Rejected.Add(pcns.Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= StartDate && p.CreatedDate.Value <= EndDate && p.Status == -1).Count());
                        data.Total.Add(pcns.Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= StartDate && p.CreatedDate.Value <= EndDate).Count());

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

                    foreach (var dept in dbContext.Department_Set.Include(d => d.Customer).ToList())
                    {

                        var deptCount = dbContext.PCN_Set.Count(p => p.Status == 1 && 
                                                                dbContext.Employee_Set.Any(e => e.EmployeeID == p.CreatedBy && 
                                                                e.DepartmentEmployees.FirstOrDefault().Department.DepartmentID == dept.DepartmentID));
                        if(deptCount > 0)
                        {
                            data.IdDepartments.Add(dept.DepartmentID);
                            data.Series.Add(new Serie
                            {
                                name = $"{dept.DepartmentName} ({dept.Customer.CustomerName})",
                                data = new List<object>(),
                            });
                        }
                    }

                    DateTime thresholdDate = DateTime.Now.AddMonths(-12);
                    thresholdDate = new DateTime(thresholdDate.Year, thresholdDate.Month, 1);

                    var pcns = dbContext.PCN_Set.Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= thresholdDate);

                    for (int i = 1; i < 13; i++)
                    {
                        DateTime StartDate = thresholdDate.AddMonths(i);
                        StartDate = new DateTime(StartDate.Year, StartDate.Month, 1);

                        DateTime EndDate = thresholdDate.AddMonths(i + 1);
                        EndDate = new DateTime(EndDate.Year, EndDate.Month, 1);

                        data.Categories.Add(StartDate.ToString("yyyy-MMM"));

                        foreach(var IdDept in data.IdDepartments)
                        {
                            int deptCount = pcns.Where(p => p.CreatedDate.HasValue &&
                                                            p.CreatedDate.Value >= StartDate &&
                                                            p.CreatedDate.Value <= EndDate &&
                                                            dbContext.Employee_Set.Any(e => e.EmployeeID == p.CreatedBy &&
                                                            e.DepartmentEmployees.FirstOrDefault().Department.DepartmentID == IdDept)).Count();

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

                    var result = dbContext.PCN_Set.OrderByDescending(p => p.CreatedDate).Take(10).ToList();


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

                    List<object> list = new List<object>();
                    foreach(var item in dbContext.PCNConfirm_Set.OrderByDescending(p => p.ConfirmedDate).Take(10).ToList())
                    {
                        var data = new
                        {
                            Date = item.ConfirmedDate,
                            User = dbContext.Employee_Set.Select(e => new
                            {
                                EmployeeID = e.EmployeeID,
                                CardId = e.EmployeeCode,
                                Name = e.EmployeeCNName
                            }).FirstOrDefault(e => e.EmployeeID == item.ConfirmedBy),
                            PCNID = dbContext.PCN_Set.FirstOrDefault(p => p.PCNID == item.PCNID).PCNCode,
                            Status = item.Status,
                        };

                        list.Add(data);
                    }

                    return list;
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