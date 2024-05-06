﻿using IE_MSC.Areas.Entities;
using System;
using System.Linq;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_User
    {
        /* GET FOR AUTHENTICATION */
        public static Employee_ GetUser(string IdOrUsername, bool IsUsername = false)
        {
            try
            {
                using(var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    if(IsUsername)
                    {
                        var user = context.Employee_Set.FirstOrDefault(u => u.Username.ToUpper() == IdOrUsername.ToUpper());
                        if(user != null)
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
                        var user = context.Employee_Set.FirstOrDefault(u => u.EmployeeID.ToUpper() == IdOrUsername.ToUpper());
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
        public static Employee_ GetUser(string Username, string Password, bool IsThrowEx = true)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var users = context.Employee_Set.Where(u => u.Username.ToUpper() == Username).ToList();

                    if (users != null && users.Count > 0)
                    {
                        var user = users.FirstOrDefault(u => u.Password == Password.Trim());
                        if(user != null)
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
        public static object GetUser(string Id)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var user = context.Employee_Set.Select(u => new
                    {
                        Id = u.EmployeeID,
                        CardID = u.EmployeeCode,
                        VnName = u.EmployeeVNName,
                        CnName = u.EmployeeCNName,
                        Email = u.Email,
                        Departments = u.DepartmentEmployees.Select(d => new { d.Department, d.Department.Customer }).ToList()
                    }).FirstOrDefault(u => u.Id.ToUpper() == Id.ToUpper());

                    return user;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetSessionUser()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var sessionUser = Common.GetSessionUser();

                    if(sessionUser != null)
                    {
                        var user = context.Employee_Set.Select(u => new
                        {
                            Id = u.EmployeeID,
                            CardID = u.EmployeeCode,
                            VnName = u.EmployeeVNName,
                            CnName = u.EmployeeCNName,
                            Email = u.Email,
                            Departments = u.DepartmentEmployees.Select(d => new { d.Department, d.Department.Customer }).ToList()
                        }).FirstOrDefault(u => u.Id.ToUpper() == sessionUser.EmployeeID.ToUpper());

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
        public static object GetUsers()
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var users = context.Employee_Set.Select(u => new
                    {
                        Id = u.EmployeeID,
                        CardID = u.EmployeeCode,
                        VnName = u.EmployeeVNName,
                        CnName = u.EmployeeCNName,
                        Email = u.Email,
                        Departments = u.DepartmentEmployees.Select(d => new { d.Department, d.Department.Customer }).ToList()
                    }).ToList();

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

                    var customerDepartments = context.Customer_Set.Select(c => new
                    {
                        Id = c.CustomerID,
                        c.CustomerName,
                        Departments = context.Department_Set.Select(d => new
                        {
                            Id = d.DepartmentID,
                            IdCustomer = d.CustomerID,
                            DepartmentName = d.DepartmentName
                        }).Where(d => d.IdCustomer == c.CustomerID).ToList()
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

                    var departments = context.Department_Set.Select(d => new
                    {
                        Id = d.CustomerID,
                        d.DepartmentName,
                        Customer = new
                        {
                            Id = d.CustomerID,
                            CustoemrName = d.Customer.CustomerName
                        }
                    }).ToList();

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