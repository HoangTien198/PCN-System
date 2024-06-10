using IE_MSC.Areas.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_User
    {
        /* GET FOR AUTHENTICATION */
        public static Entities.User GetUser(string IdOrUsername, bool IsUsername = false)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    if (IsUsername)
                    {
                        var user = context.Users.FirstOrDefault(u => u.Username.ToUpper() == IdOrUsername.ToUpper());
                        if (user != null)
                        {
                            return user;
                        }
                        else
                        {
                            throw new Exception("Invalid Username.");
                        }
                    }
                    else
                    {
                        var user = context.Users.FirstOrDefault(u => u.Id.ToUpper() == IdOrUsername.ToUpper());
                        if (user != null)
                        {
                            return user;
                        }
                        else
                        {
                            throw new Exception("Invalid User ID.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static Entities.User GetUser(string Username, string Password, bool IsThrowEx = true)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var users = context.Users.Where(u => u.Username.ToUpper() == Username).ToList();

                    if (users != null && users.Count > 0)
                    {
                        var user = users.FirstOrDefault(u => u.Password == Password.Trim());
                        if (user != null)
                        {
                            return user;
                        }
                        else
                        {
                            if (IsThrowEx)
                            {
                                throw new Exception("Invalid Password.");
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                    else
                    {
                        if (IsThrowEx)
                        {
                            throw new Exception("Invalid Username.");
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static Entities.User GetUser(string Id)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var user = context.Users.Include(u => u.UserDepartments.Select(d => d.Department.Customer))
                                            .FirstOrDefault(u => u.Id.ToUpper() == Id.ToUpper());

                    return user;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static Entities.User GetSessionUser()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var sessionUser = Common.GetSessionUser();

                    if (sessionUser != null)
                    {
                        var user = context.Users.Include(u => u.UserDepartments.Select(d => d.Department))
                                                .Include(u => u.UserDepartments.Select(d => d.Department.Customer))
                                                .FirstOrDefault(u => u.Id.ToUpper() == sessionUser.Id.ToUpper());

                        return user;
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
        public static List<Entities.User> GetUsers()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var users = context.Users.Include(u => u.UserDepartments.Select(d => d.Department.Customer))
                                             .ToList();

                    return users;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetCustomerDepartments()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var customerDepartments = context.Customers.Select(c => new
                    {
                        c.Id,
                        c.CustomerName,
                        Departments = context.Departments.Where(d => d.IdCustomer.ToUpper() == c.Id.ToUpper()).ToList()
                    }).ToList();

                    return customerDepartments;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static object GetDepartments()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var departments = context.Departments.ToList();

                    return departments;
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