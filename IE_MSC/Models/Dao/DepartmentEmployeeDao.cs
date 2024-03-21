using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.Dao
{
    public class DepartmentEmployeeDao
    {
        private PCNDbContext db = null;
        public DepartmentEmployeeDao()
        {
            db = new PCNDbContext();
        }

        /// <summary>
        /// Hàm kiểm tra nhân viên đã có dữ liệu trong phòng ban chưa
        /// </summary>
        /// <param name="employeeID">ID nhân viên(GUID)</param>
        /// <param name="departmentID">ID phòng ban</param>
        /// <returns>true: đã có | false: chưa có</returns>
        public bool CheckEmployeeInDepartment(string employeeID, string departmentID)
        {
            try
            {
                var check = db.DepartmentEmployees.FirstOrDefault(de => de.DepartmentID == departmentID && de.EmployeeID == employeeID);
                if (check != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
            }
            
        }

        /// <summary>
        /// Hàm bổ nhiệm employee vào phòng ban
        /// </summary>
        /// <param name="employeeID"></param>
        /// <param name="departmentID"></param>
        /// <returns>1: ok , 0: đã có trong phòng ban, -1: server error</returns>
        public int AppointToDepartment(string employeeID, string departmentID)
        {
            try
            {
                if (CheckEmployeeInDepartment(employeeID, departmentID) == true)
                {
                    return 0;// đã có trong phòng ban
                }
                else
                {
                    var temp = new DepartmentEmployee();
                    temp.DepartmentID = departmentID;
                    temp.EmployeeID = employeeID;
                    temp.CreatedDate = DateTime.Now;

                    db.DepartmentEmployees.Add(temp);
                    db.SaveChanges();
                    return 1;// ok
                }
            }
            catch (Exception)
            {
                return -1;// server error
            }
            
        }
    }
}