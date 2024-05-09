using IE_MSC.Areas.Entities;
using IE_MSC.Commons;
using IE_MSC.Models.Entities;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Helpers;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_Emails
    {
        public static bool SendSignRequestEmail(Entities.MSC application, SignMSC sign)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSignRequest");

                if (htmlBody == null || sign == null || application == null) return false;

                var filePaths = new
                {
                    BeforeFilePath = (application.BeforeChangeFile != null) ? HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{application.BeforeChangeFile}") : null,
                    AfterFilePath = (application.AfterChangeFile != null) ? HttpContext.Current.Server.MapPath($"/Assets/Media/FileMSC/{application.AfterChangeFile}") : null,
                };
                var fileSizes = new
                {
                    BeforeFileSize = File.Exists(filePaths.BeforeFilePath) ? $"{((double)(new FileInfo($"/Assets/Media/FileMSC/{application.BeforeChangeFile}").Length) / (1024 * 1024)):0.##} MB" : null,
                    AfterFileSize = File.Exists(filePaths.AfterFilePath) ? $"{((double)(new FileInfo(filePaths.AfterFilePath).Length) / (1024 * 1024)):0.##} MB" : null,
                };

                var ss = new FileInfo(filePaths.BeforeFilePath);
                // make sign url
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/MSC/SignManagement/DirectSign/?code=";
                string code= Common.StringToBase64Decode($"{application.Id},{sign.IdUser},{DateTime.Now}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", sign.User.Email);
                htmlBody = htmlBody.Replace("{DateCreated}", application.DateCreated?.ToString("yyyy-MM-dd HH:mm:ss"));
                htmlBody = htmlBody.Replace("{Subject}", Common.RemoveStringAccents(application.Subject));
                htmlBody = htmlBody.Replace("{UserCreated}", Common.CreateUserName(sign.User));
                htmlBody = htmlBody.Replace("{Process}", Common.RemoveStringAccents(application.Process));
                htmlBody = htmlBody.Replace("{Department}", R_MSC.GetApplicationDepartment(application.Id));
                htmlBody = htmlBody.Replace("{Model}", Common.RemoveStringAccents(application.Model));
                htmlBody = htmlBody.Replace("{BeforeChange}", Common.UrlDecode(application.BeforeChange));
                htmlBody = htmlBody.Replace("{AfterChange}", Common.UrlDecode(application.AfterChange));
                htmlBody = htmlBody.Replace("{BeforeChangeFile}", $"<a href=\"{filePaths.BeforeFilePath}\">{application.BeforeChangeFile} ({fileSizes.BeforeFileSize})</a>");
                htmlBody = htmlBody.Replace("{AfterChangeFile}", $"<a href=\"{filePaths.AfterFilePath}\">{application.AfterChange} ({fileSizes.AfterFileSize})</a>");
                htmlBody = htmlBody.Replace("{Reason}", Common.UrlDecode(application.Reason));
                htmlBody = htmlBody.Replace("{CalcCost}", Common.UrlDecode(application.CalcCost));
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");


                // send email
                Common.SendEmail(new Email
                {
                    MailTo = sign.User.Email,
                    MailCC = "",
                    MailSubject = $"【 Project Management 】New sign request.",
                    MailContent = htmlBody,
                    MailType = "html"
                });

                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}