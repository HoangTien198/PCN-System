using IE_MSC.Commons;
using IE_MSC.Models.Entities;
using IE_MSC.Models.ViewModel;
using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;

namespace IE_MSC.Models.Dao
{
    public class CustomerDao
    {
        private PCNDbContext db = null;
        public CustomerDao()
        {
            db = new PCNDbContext();
        }

        public string Get()
        {
            try
            {
                var customers = db.Customers.Select(c => new CustomerVM
                {
                    CustomerID = c.CustomerID,
                    CustomerName = c.CustomerName,
                    CreatedBy = c.CreatedBy,
                    CreatedDate = c.CreatedDate,    
                    Description = c.Description,
                    UpdatedBy = c.UpdatedBy,
                    UpdatedDate = c.UpdatedDate,
                }).OrderBy(c => c.CustomerName);
                var result = JsonSerializer.Serialize(customers);
                return result;
            }
            catch (Exception)
            {

                return "";
            }
        }

        public CustomerVM GetById(string id)
        {
            try
            {
                var customer = db.Customers.FirstOrDefault(c => c.CustomerID == id);
                var cusVM = new CustomerVM
                {
                    CreatedBy = customer.CreatedBy,
                    CustomerName = customer.CustomerName,
                    CustomerID = customer.CustomerID,
                    CreatedDate = customer.CreatedDate,
                    Description = customer.Description,
                    UpdatedBy = customer.UpdatedBy,
                    UpdatedDate = customer.UpdatedDate
                };
                return cusVM;
            }
            catch (Exception)
            {
                return null;
            }
            
        }

        public int SaveAfterCreate(string customerName, string customerDescription)
        {
            try
            {
                var cus = db.Customers.FirstOrDefault(c => c.CustomerName.Trim().ToUpper() == customerName.Trim().ToUpper());
                if (cus == null)
                {
                    var cusID = Guid.NewGuid();
                    var newCustomer = new Customer();
                    newCustomer.CustomerID = cusID.ToString();
                    newCustomer.CustomerName = customerName.Trim();
                    newCustomer.Description = customerDescription.Trim();
                    newCustomer.CreatedBy = "ADMIN";
                    newCustomer.CreatedDate = DateTime.Now;
                    db.Customers.Add(newCustomer);
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

        public int SaveAfterEdit(string customerID, string customerName, string customerDescription)
        {
            try
            {
                var cus = db.Customers.FirstOrDefault(c => c.CustomerID == customerID);

                if (FormatUnicode.ReplaceUnicode(customerName).ToUpper() != FormatUnicode.ReplaceUnicode(cus.CustomerName).ToUpper())
                {
                    cus.CustomerName = customerName.Trim();
                    cus.Description = customerDescription.Trim();
                    cus.UpdatedBy = "ADMIN";
                    cus.UpdatedDate = DateTime.Now;
                    db.SaveChanges();
                    return 1;// ok
                }
                else
                {
                    cus.Description = customerDescription.Trim();
                    cus.UpdatedBy = "ADMIN";
                    cus.UpdatedDate = DateTime.Now;
                    db.SaveChanges();
                    return 1;//đã có
                }
            }
            catch (Exception)
            {
                return -1;//Server error
            }
        }

        public int Delete(string customerID)
        {
            try
            {
                var cus = db.Customers.FirstOrDefault(c => c.CustomerID == customerID);
                db.Customers.Remove(cus);
                db.SaveChanges();
                return 1;//ok
            }
            catch (Exception)
            {
                return -1;//error
            }
        }
    }
}