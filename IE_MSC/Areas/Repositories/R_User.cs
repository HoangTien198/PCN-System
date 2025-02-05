﻿using IE_MSC.Areas.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;

namespace IE_MSC.Areas
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

        // POST
        public static Entities.User CreateUser(Entities.User user)
        {

            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbUser = context.Users.FirstOrDefault(u => u.Username == user.Username || u.CardId == user.Username);

                    if (dbUser != null) throw new Exception("User already exists.");

                    user.Id = Guid.NewGuid().ToString();
                    user.CardId = user.Username;

                    foreach (var userDept in user.UserDepartments)
                    {
                        var department = context.Departments.FirstOrDefault(d => d.Id == userDept.IdDepartment);
                        if (department != null)
                        {
                            userDept.IdUser = user.Id;
                        }
                    }

                    context.Users.Add(user);
                    context.SaveChanges();
                    transaction.Commit();

                    return GetUser(user.Id);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public static Entities.User UpdateUser(Entities.User user)
        {

            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbUser = context.Users.FirstOrDefault(u => u.Id == user.Id);
                    if (dbUser == null) throw new Exception("User does not exists.");

                    user.CardId = user.Username;

                    var userDepts = context.UserDepartments.Where(ud => ud.IdUser == user.Id);
                    context.UserDepartments.RemoveRange(userDepts);

                    foreach (var userDept in user.UserDepartments)
                    {
                        var department = context.Departments.FirstOrDefault(d => d.Id == userDept.IdDepartment);
                        if (department != null)
                        {
                            userDept.IdUser = user.Id;
                            context.UserDepartments.Add(userDept);
                        }
                    }

                    context.Users.AddOrUpdate(user);
                    context.SaveChanges();
                    transaction.Commit();

                    return GetUser(user.Id);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
        public static bool DeleteUser(string IdUser)
        {

            using (var context = new PcnEntities())
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    context.Configuration.LazyLoadingEnabled = false;

                    var dbUser = context.Users.FirstOrDefault(u => u.Id == IdUser);
                    if (dbUser == null) throw new Exception("User does not exists.");

                    var userDepts = context.UserDepartments.Where(ud => ud.IdUser == dbUser.Id).ToList();
                    context.UserDepartments.RemoveRange(userDepts);

                    context.Users.Remove(dbUser);
                    context.SaveChanges();
                    transaction.Commit();

                    return true;

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}