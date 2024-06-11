using IE_MSC.Areas.Entities;
using System;
using System.Data.Entity.Migrations;
using System.Linq;

namespace IE_MSC.Areas
{
    internal class R_Customer
    {
        /* GET */
        public static object GetCustomer(string IdCustomer)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var customer = context.Customers.Select(c => new
                    {
                        c.Id,
                        c.CustomerName,
                        Departments = context.Departments.Where(d => d.IdCustomer.ToUpper() == c.Id.ToUpper()).ToList()
                    }).FirstOrDefault(c => c.Id == IdCustomer);

                    return customer;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
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
        public static object CreateCustomer(Entities.Customer customer)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbCustomer = context.Customers.FirstOrDefault(c => c.CustomerName.ToUpper().Trim() == customer.CustomerName.ToUpper().Trim());
                    if(dbCustomer == null)
                    {
                        customer.Id = Guid.NewGuid().ToString();
                        context.Customers.Add(customer);
                        context.SaveChanges();

                        return GetCustomer(customer.Id);
                    }
                    else
                    {
                        throw new Exception("Customer already exists.");
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static object UpdateCustomer(Entities.Customer customer)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbCustomer = context.Customers.FirstOrDefault(c => c.Id == customer.Id);
                    if (dbCustomer != null)
                    {
                        dbCustomer.CustomerName = customer.CustomerName;

                        context.Customers.AddOrUpdate(dbCustomer);
                        context.SaveChanges();

                        return GetCustomer(customer.Id);
                    }
                    else
                    {
                        throw new Exception("Customer does not exists.");
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static object DeleteCustomer(string IdCustomer)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbCustomer = context.Customers.FirstOrDefault(c => c.Id == IdCustomer);
                    if (dbCustomer != null)
                    {
                        context.Customers.Remove(dbCustomer);
                        context.SaveChanges();

                        return true;
                    }
                    else
                    {
                        throw new Exception("Customer does not exists.");
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}