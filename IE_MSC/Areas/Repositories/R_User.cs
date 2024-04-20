using IE_MSC.Areas.Entities;
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

        // POST


        // Validation

    }
}