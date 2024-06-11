using IE_MSC.Areas.Entities;
using System;
using System.Linq;

namespace IE_MSC.Areas
{
    internal class R_Customer
    {
        /* GET */
        public static object GetCustomers()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var customers = context.Customers.Select(c => new
                    {
                        c.Id,
                        c.CustomerName,
                        Departments = context.Departments.Where(d => d.IdCustomer.ToUpper() == c.Id.ToUpper()).ToList()
                    }).ToList();

                    return customers;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        // POST

    }
}