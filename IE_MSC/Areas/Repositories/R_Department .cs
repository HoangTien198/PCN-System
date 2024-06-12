using IE_MSC.Areas.Entities;
using System;
using System.Data.Entity.Migrations;
using System.Linq;

namespace IE_MSC.Areas
{
    internal class R_Department
    {
        /* GET */
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
        public static object GetDepartment(string IdDepartment)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var customer = context.Departments.FirstOrDefault(c => c.Id == IdDepartment);

                    return customer;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        // POST
        public static object CreateDepartment(Entities.Department department)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbDepartment = context.Departments
                        .FirstOrDefault(d => d.DepartmentName.ToUpper().Trim() == department.DepartmentName.ToUpper().Trim() &&
                                             d.IdCustomer == department.IdCustomer);
                    if (dbDepartment == null)
                    {
                        department.Id = Guid.NewGuid().ToString();
                        context.Departments.Add(department);
                        context.SaveChanges();

                        return GetDepartment(department.Id);
                    }
                    else
                    {
                        throw new Exception("Department already exists.");
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static object UpdateDepartment(Entities.Department department)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbDepartment = context.Departments.FirstOrDefault(d => d.Id == department.Id);
                    if (dbDepartment != null)
                    {
                        dbDepartment.DepartmentName = department.DepartmentName;

                        context.Departments.AddOrUpdate(dbDepartment);
                        context.SaveChanges();

                        return GetDepartment(department.Id);
                    }
                    else
                    {
                        throw new Exception("Department does not exists.");
                    }
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public static object DeleteDepartment(string IdDepartment)
        {
            try
            {
                using (var context = new PcnEntities())
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbDepartment = context.Departments.FirstOrDefault(d => d.Id == IdDepartment);
                    if (dbDepartment != null)
                    {
                        context.Departments.Remove(dbDepartment);
                        context.SaveChanges();

                        return true;
                    }
                    else
                    {
                        throw new Exception("Department does not exists.");
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