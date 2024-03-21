using IE_MSC.Commons;
using IE_MSC.Models.Ajax;
using IE_MSC.Models.Entities;
using IE_MSC.Models.ViewModel;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json;
using System.Web;
using System.Web.Http.Results;
using System.Web.Management;

namespace IE_MSC.Models.Dao
{
    public class OwnerStatus
    {
        public string EmployeeID { get; set; }
        public string PCNID { get; set; }
        public string EmployeeCNName { get; set; }
        public string EmployeeVNName { get; set; }
        public int SortOrder { get; set; }
        public int Status { get; set; }
    }
    public class EmployeeDao
    {
        private PCNDbContext db = null;
        public EmployeeDao()
        {
            db = new PCNDbContext();
        }
        public Employee GetByAccount(string username, string password)
        {
            var employee = db.Employees.FirstOrDefault(x => x.Username == username && x.Password == password);
            return employee;
        }

        /// <summary>
        /// Hàm lấy danh sách owner của đơn PCN
        /// </summary>
        /// <param name="PCNID">ID của đơn PCN</param>
        /// <returns>List<EmployeeVM></returns>
        public List<EmployeeVM> GetByPCNID(string PCNID)
        {
            try
            {
                var employeeVMs = (from a in db.Employees
                                   join b in db.PCNConfirms.Where(p => p.PCNID == PCNID)
                                   on a.EmployeeID equals b.EmployeeID
                                   select new EmployeeVM
                                   {
                                       EmployeeID = a.EmployeeID,
                                       EmployeeCode = a.EmployeeCode,
                                       EmployeeCNName = a.EmployeeCNName,
                                       EmployeeVNName = a.EmployeeVNName,
                                       Position = a.Position
                                   }).ToList();
                return employeeVMs;
            }
            catch (Exception)
            {

                return null;
            }
            
        }

        public string GetNameByID(string id)
        {
            try
            {
                var result = string.Empty;
                var employee = db.Employees.FirstOrDefault(e => e.EmployeeID == id);
                if (employee != null)
                {
                    result = employee.EmployeeVNName + " (" + employee.EmployeeCNName + ")";
                }

                return result;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public EmployeeVM GetByID(string employeeID)
        {
            try
            {
                var e = db.Employees.FirstOrDefault(emp => emp.EmployeeID == employeeID && emp.Status == 1);
                var EmpVM = new EmployeeVM
                {
                    EmployeeID = e.EmployeeID,
                    EmployeeCode = e.EmployeeCode,
                    EmployeeCNName = e.EmployeeCNName,
                    EmployeeVNName = e.EmployeeVNName,
                    Gender = e.Gender,
                    HireDate = e.HireDate,
                    Email = e.Email,
                    Position = e.Position,
                    DeskPhone = e.DeskPhone,
                    MobilePhone = e.MobilePhone,
                    DepartmentByAPI = e.DepartmentByAPI,
                    Username = e.Username,
                    Password = e.Password,
                    CreatedBy = e.CreatedBy,
                    CreatedDate = e.CreatedDate,
                    EmployeeAvatar = e.EmployeeAvatar,
                    IsAdmin = e.IsAdmin,
                    IsBoss = e.IsBoss,
                    UpdatedBy = e.UpdatedBy,
                    UpdatedDate = e.UpdatedDate,
                    Status = e.Status
                };
                
                return EmpVM;
            }
            catch (Exception)
            {

                return null;
            }
        }

        public List<EmployeeVM> GetByDepartmentID(string departmentID)
        {
            try
            {
                var deptEmps = db.DepartmentEmployees.Where(d => d.DepartmentID == departmentID);
                var employees = db.Employees.Where(e => e.Status == 1);

                var result = (from a in employees
                              join b in deptEmps
                             on a.EmployeeID equals b.EmployeeID
                              select new EmployeeVM
                              {
                                  EmployeeID = a.EmployeeID,
                                  EmployeeCNName = a.EmployeeCNName,
                                  EmployeeVNName = a.EmployeeVNName,
                                  CreatedBy = a.CreatedBy,
                                  CreatedDate = a.CreatedDate,
                                  DepartmentByAPI = a.DepartmentByAPI,
                                  DeskPhone = a.DeskPhone,
                                  Email = a.Email,
                                  EmployeeAvatar = a.EmployeeAvatar,
                                  EmployeeCode = a.EmployeeCode,
                                  Gender = a.Gender,
                                  HireDate = a.HireDate,
                                  IsAdmin = a.IsAdmin,
                                  IsBoss = a.IsBoss,
                                  MobilePhone = a.MobilePhone,
                                  Password = a.Password,
                                  Status = a.Status,
                                  UpdatedBy = a.UpdatedBy,
                                  UpdatedDate = a.UpdatedDate,
                                  Username = a.Username,
                                  Position = a.Position
                              }).ToList();
                return result;
            }
            catch (Exception)
            {

                return null;
            }
            
        }

        public List<OwnerStatus> GetOwnerStatus(string pcnID)
        {
            try
            {
                var pcnConfirms = db.PCNConfirms.Where(p => p.PCNID == pcnID);
                var employees = db.Employees.Select(e=>e);
                var deptEmps = db.DepartmentEmployees.Select(d => d);
                var departments = db.Departments.Select(f1 => f1);

                var qr1 = db.PCNConfirms.Where(p => p.PCNID == pcnID);
                var qr2 = db.Employees.Select(e => e);
                var qr3 = from a in qr1
                          join b in qr2
                          on a.EmployeeID equals b.EmployeeID
                          select new OwnerStatus
                          {
                              PCNID = a.PCNID,
                              EmployeeID = b.EmployeeID,
                              EmployeeCNName = b.EmployeeCNName,
                              EmployeeVNName = b.EmployeeVNName,
                              Status = (int)a.Status,
                              SortOrder = (int)a.SortOrder
                          };

                var result = qr3.OrderBy(s => s.SortOrder).ToList();
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<EmployeeVM> GetAllEmployeeVM()
        {
            var result = db.Employees.Where(e => e.Status == 1).Select(e => new EmployeeVM
            {
                EmployeeID = e.EmployeeID,
                EmployeeCNName = e.EmployeeCNName,
                EmployeeVNName = e.EmployeeVNName,
                CreatedBy = e.CreatedBy,
                CreatedDate = e.CreatedDate,
                DepartmentByAPI = e.DepartmentByAPI,
                DeskPhone = e.DeskPhone,
                Email = e.Email,
                EmployeeAvatar = e.EmployeeAvatar,
                EmployeeCode = e.EmployeeCode,
                Gender = e.Gender,
                HireDate = e.HireDate,
                IsAdmin = e.IsAdmin,
                IsBoss = e.IsBoss,
                MobilePhone = e.MobilePhone,
                Password = e.Password,
                Status = e.Status,
                UpdatedBy = e.UpdatedBy,
                UpdatedDate = e.UpdatedDate,
                Username = e.Username
            }).ToList();

            return result;
        }

        public int SaveEmployeeAfterCreate(AjaxEmployee data)
        {
            try
            {
                var dtNow = DateTime.Now;
                var empTemp = db.Employees.FirstOrDefault(e => e.EmployeeCode.Trim().ToUpper() == data.EmployeeCode.Trim().ToUpper());
                if (empTemp == null)
                {
                    //tạo mới:
                    var employeeID = Guid.NewGuid();
                    var emp = new Employee();
                    emp.EmployeeID = employeeID.ToString();
                    emp.EmployeeCode = data.EmployeeCode.ToUpper();
                    emp.EmployeeCNName = data.EmployeeCNName.ToUpper();
                    emp.EmployeeVNName = data.EmployeeVNName;
                    emp.Gender = data.Gender;
                    emp.HireDate = DateTime.Parse(data.HireDate);
                    emp.Email = data.Email;
                    emp.DeskPhone = data.DeskPhone;
                    emp.DepartmentByAPI = data.DepartmentAPI;
                    emp.Username = data.Username;
                    emp.Password = data.Password;
                    emp.CreatedDate = dtNow;
                    emp.Status = 1;
                    emp.Position = data.Position;
                    emp.IsBoss = (data.Position == 1) ? true : false;
                    emp.IsAdmin = (data.Position == 0) ? true : false;
                    db.Employees.Add(emp);
                    db.SaveChanges();
                    return 1;//Success
                }
                else
                {
                    return 0;//đã có
                }
            }
            catch (Exception)
            {
                return -1;// Server Error;
            }

        }


        /// <summary>
        /// Hàm kiểm tra nhân viên có ở trong bộ phận IE hay không và nếu ở bộ phận IE thì có chức vụ gì?
        /// </summary>
        /// <param name="employeeID"></param>
        /// <returns>0: không phải IE, 2: Sếp Paolo, 3: Leader IE (Huyen, Nga), 4: Employee IE</returns>
        public int CheckEmployeeInIE(string employeeID)
        {
            var countIE = 0;
            var emp = db.Employees.FirstOrDefault(e => e.EmployeeID == employeeID);
            var deptEmps = db.DepartmentEmployees.Where(e => e.EmployeeID == employeeID);
            var depts = db.Departments.Select(d => d);
            var deptOfEmp = from a in deptEmps
                            join b in depts
                            on a.DepartmentID equals b.DepartmentID
                            select b;

            foreach (var item in deptOfEmp)
            {
                if(item.IsIE == true)
                {
                    countIE++;
                    break;
                }
            }

            if (countIE == 0)
            {
                return 0;
            }
            {
                if (emp.Position == 2)
                {
                    return 2;// Vice-Director (Paolo)
                }
                if (emp.Position == 3)
                {
                    return 3;// Leader IE (Huyen, Nga)
                }
                if (emp.Position == 4)
                {
                    return 4;// Employee IE
                }
            }
            return 0;
        }

        public int SaveEmployeeAfterEdit(AjaxEmployee data)
        {
            try
            {
                var emp = db.Employees.FirstOrDefault(e => e.EmployeeID == data.EmployeeID);
                emp.EmployeeVNName = data.EmployeeVNName;
                emp.Username = data.Username;
                emp.Password = data.Password;
                emp.Email = data.Email;
                emp.DeskPhone = data.DeskPhone;
                emp.Position = data.Position;
                emp.IsBoss = (data.Position == 1) ? true : false;
                emp.IsAdmin = (data.Position == 0) ? true : false;
                db.SaveChanges();
                return 1;//OK
            }
            catch (Exception)
            {
                return -1;// Server Error;
            }

        }

        /// <summary>
        /// Hàm đổi mật khẩu
        /// </summary>
        /// <param name="currentPassword"></param>
        /// <param name="newPassword"></param>
        /// <param name="renewPassword"></param>
        /// <param name="userLogin"></param>
        /// <returns>1: Success | 0: mật khẩu cũ truyền vào chưa đúng | -1: Mật khẩu mới nhập lại lần 2 không giống nhau | -2: Server Error</returns>
        public int ChangePassword(string currentPassword, string newPassword, string renewPassword, AccountLogin userLogin)
        {
            try
            {
                var uLogin = db.Employees.FirstOrDefault(e => e.EmployeeID == userLogin.EmployeeID);
                if (currentPassword == uLogin.Password)
                {
                    if (newPassword == renewPassword)
                    {
                        var employee = db.Employees.FirstOrDefault(e => e.EmployeeID == userLogin.EmployeeID);
                        employee.Password = newPassword;
                        db.SaveChanges();
                        return 1;// thành công
                    }
                    else
                    {
                        return -1;//Mật khẩu mới nhập lại lần 2 không giống nhau
                    }
                }
                else
                {
                    return 0;//mật khẩu cũ truyền vào chưa đúng
                }
            }
            catch (Exception)
            {

                return -2;//Server Error;
            }


        }

        public string GetOwnerDepartmentById(string employeeID)
        {
            try
            {
                var resultString = "";
                var deptEmps = db.DepartmentEmployees.Where(s => s.EmployeeID == employeeID);

                var depts = (from a in deptEmps
                             join b in db.Departments
                            on a.DepartmentID equals b.DepartmentID
                            select b);
                var result = (from d in depts
                             group d.DepartmentID by d.DepartmentName into g
                             select new { DepartmentName = g.Key, DepartmentID = g.ToList() }).ToList();

                foreach (var item in result)
                {
                    resultString += item.DepartmentName + ",";
                }

                return resultString.Remove(resultString.Length - 1);
            }
            catch (Exception)
            {

                return "";
            }
            
        }
    }
}