using IE_MSC.Models.Dao;
using IE_MSC.Models.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Text;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Controllers
{
    public class EmployeeController : Controller
    {
        // GET: Employee
        public ActionResult Index()
        {
            return View();
        }

        #region AJAX
        public string GetAllEmployee()
        {
            var dao = new EmployeeDao();
            var result = dao.GetAllEmployeeVM();
            var jsonResult = JsonSerializer.Serialize(result);
            return jsonResult;
        }

        public string GetByDepartmentID(string departmentID)
        {
            var dao = new EmployeeDao();
            var result = dao.GetByDepartmentID(departmentID);
            if (result == null)
            {
                return "";
            }
            else
            {
                var jsonResult = JsonSerializer.Serialize(result);
                return jsonResult;
            }
        }
        class EmployeeAPI
        {
            public string id { get; set; }
        }
        public string GetByAPI(string url)
        {
            try
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                string jsonString = "";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                request.Credentials = CredentialCache.DefaultCredentials;
                ((HttpWebRequest)request).UserAgent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 7.1; Trident/5.0)";
                request.Accept = "/";
                request.UseDefaultCredentials = true;
                request.Proxy.Credentials = System.Net.CredentialCache.DefaultCredentials;
                request.ContentType = "application/x-www-form-urlencoded";

                WebResponse response = request.GetResponse();
                StreamReader sr = new StreamReader(response.GetResponseStream());
                jsonString = sr.ReadToEnd();
                sr.Close();
                return jsonString;
            }
            catch (Exception e)
            {
                return "";
            }
        }

        public string GetById(string employeeID)
        {
            var dao = new EmployeeDao();
            var result = dao.GetByID(employeeID);
            if (result != null)
            {
                var jsonResult = JsonSerializer.Serialize(result);
                return jsonResult;

            }
            else
            {
                return "";
            }
        }
        #endregion
    }
}