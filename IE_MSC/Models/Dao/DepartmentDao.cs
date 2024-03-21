using IE_MSC.Models.Entities;
using IE_MSC.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.Dao
{
    public class DepartmentDao
    {
        private PCNDbContext db = null;
        public DepartmentDao()
        {
            db = new PCNDbContext();
        }

        public List<DepartmentVM> GetAllDepartmentVMByCustomer(string customerID)
        {
            List<DepartmentVM> results = new List<DepartmentVM>();
            if (string.IsNullOrEmpty(customerID))//All Department
            {
                results = db.Departments.Select(d => new DepartmentVM
                {
                    CustomerID = d.CustomerID,
                    DepartmentID = d.DepartmentID,
                    CreatedBy = d.CreatedBy,
                    CreatedDate = d.CreatedDate,
                    DepartmentName = d.DepartmentName,
                    UpdatedBy = d.UpdatedBy,
                    UpdatedDate = d.UpdatedDate,
                    CustomerName = d.Customer.CustomerName
                }).OrderBy(d => d.CustomerName).ThenBy(d=>d.DepartmentName).ToList();
            }
            else
            {
                results = db.Departments.Where(d => d.CustomerID == customerID).OrderBy(dc => dc.Customer.CustomerName).ThenBy(dc=>dc.DepartmentName).Select(item => new DepartmentVM
                {
                    CustomerID = item.CustomerID,
                    DepartmentID = item.DepartmentID,
                    DepartmentName= item.DepartmentName,
                    CreatedBy = item.CreatedBy,
                    CreatedDate = item.CreatedDate,
                    UpdatedBy= item.UpdatedBy,
                    UpdatedDate= item.UpdatedDate,
                    CustomerName = item.Customer.CustomerName
                }).ToList();
            }
            return results;
        }

        public DepartmentVM GetByDepartmentID(string departmentID)
        {
            var dept = db.Departments.FirstOrDefault(d => d.DepartmentID == departmentID);
            return new DepartmentVM
            {
                DepartmentID = dept.DepartmentID,
                CreatedBy = dept.CreatedBy,
                CreatedDate = dept.CreatedDate,
                DepartmentName = dept.DepartmentName,
                CustomerName = dept.Customer.CustomerName,
                CustomerID = dept.CustomerID,
                UpdatedBy = dept.UpdatedBy,
                UpdatedDate = dept.UpdatedDate
            };
        }

        public List<DepartmentVM> GetVMByEmployeeID(string employeeID)
        {
            var deptEmp = db.DepartmentEmployees.Where(de => de.EmployeeID == employeeID);
            var dept = db.Departments.Select(d=>d);

            var result = (from a in dept
                         join b in deptEmp
                         on a.DepartmentID equals b.DepartmentID
                         select new DepartmentVM
                         {
                             DepartmentID = a.DepartmentID,
                             DepartmentName = a.DepartmentName,
                             CustomerID = a.Customer.CustomerID,
                             CustomerName = a.Customer.CustomerName,
                             CreatedBy = a.CreatedBy,
                             CreatedDate = a.CreatedDate,
                             UpdatedBy = a.UpdatedBy,
                             UpdatedDate = a.UpdatedDate
                         }).ToList();
            return result;
        }

        public int SaveAfterCreate(string departmentName, string customerID)
        {
            try
            {
                if (checkDeptInCustomer(departmentName, customerID) == false)
                {
                    var departmentID = Guid.NewGuid();
                    var newDept = new Department();
                    newDept.DepartmentID = departmentID.ToString();
                    newDept.DepartmentName = departmentName.Trim().ToUpper();
                    newDept.CustomerID = customerID;
                    newDept.CreatedDate = DateTime.Now;
                    db.Departments.Add(newDept);
                    db.SaveChanges();
                    return 1;// ok
                }
                else
                {
                    return 0;//đã có
                }
            }
            catch (Exception)
            {
                return -1;//Server error
            }
        }

        public int SaveAfterEdit(string departmentName, string customerID, string departmentID)
        {
            try
            {
                var dept = db.Departments.FirstOrDefault(x => x.DepartmentID == departmentID);
                if (checkDeptInCustomer(departmentName, customerID) == false)
                {
                    dept.DepartmentName = departmentName.Trim().ToUpper();
                    dept.CustomerID = customerID;
                    dept.UpdatedDate = DateTime.Now;
                    db.SaveChanges();
                    return 1;// thành công
                }
                else
                {
                    return 0;// đã có
                }
            }
            catch (Exception)
            {

                return -1;//Server error
            }
            
        }

        public bool checkDeptInCustomer(string departmentName, string customerID)
        {
            var depts = db.Departments.FirstOrDefault(d => (d.CustomerID.Trim().ToUpper() == customerID.Trim().ToUpper()) && (d.DepartmentName.Trim().ToUpper() == departmentName.Trim().ToUpper()));
            if (depts != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}