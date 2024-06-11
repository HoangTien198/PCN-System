using IE_MSC.Areas.Entities;
using System;
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

        // POST

    }
}