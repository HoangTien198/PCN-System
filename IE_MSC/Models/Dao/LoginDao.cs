using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.Dao
{
    public class LoginDao
    {
        private PCNDbContext db = null;
        public LoginDao()
        {
            db = new PCNDbContext();
        }

        /// <summary>
        /// Hàm kiểm tra quyền hạn đăng nhập
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>-1: Login fail(No account) | 0: Admin | 1: Boss | 2: IE | 3: Senior | 4: Leader | 5: Employee</returns>
        public int checkLogin(string username, string password)
        {
            var user = db.Employees.FirstOrDefault(u => u.Username == username && u.Password == password);
            if (user == null)
            {
                return -1;// Không tìm thấy user (sai thông tin đăng nhập);
            }
            else
            {
                // Kiểm tra xem có phải admin hay ko:
                if (user.Position == 0)
                {
                    return 0;//Admin
                }
                else
                {
                    // Kiểm tra có phải boss hay không:
                    if (user.Position == 1)
                    {
                        return 1;// Boss
                    }
                    else
                    {
                        try
                        {
                            var checkIE = checkIsIE(user.EmployeeID);
                            if (checkIE == true)
                            {
                                return 2;//IE
                            }
                            else
                            {
                                return 3;//Dept Normal
                            }
                        }
                        catch (Exception)
                        {
                            return -1;// Chưa có dữ liệu của user Login
                        }
                        
                    }
                }
            }
        }//End check login
        
        public bool checkIsIE(string employeeID)
        {
            // Lấy danh sách phòng ban của userLogin:
            var deptEmps = db.DepartmentEmployees.Where(de => de.EmployeeID == employeeID).ToList();
            var departments = db.Departments.Select(s => s);
            var lstDepartment = (from a in deptEmps
                                join b in departments
                                on a.DepartmentID equals b.DepartmentID
                                select b).ToList();
            foreach (var item in lstDepartment)
            {
                if (item.IsIE == true)
                    return true;
            }
            return false;

        }
    }
}