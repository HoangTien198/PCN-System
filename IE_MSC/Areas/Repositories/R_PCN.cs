using IE_MSC.Areas.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_PCN
    {
        // GET
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
        public static object GetPcnData()
        {
            try
            {
                using (PcnEntities dbContext = new PcnEntities())
                {

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

        // POST


        // Validation

    }
}