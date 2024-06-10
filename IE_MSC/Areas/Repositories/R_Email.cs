using IE_MSC.Areas.Entities;
using System;
using System.Configuration;
using System.IO;
using System.Web;

namespace IE_MSC.Areas.Dashboard.Controllers
{
    internal class R_Emails
    {
        public static bool SendSignRequestEmail(Entities.Application application, Sign sign, bool IsSendBoss)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSignRequest");

                if (htmlBody == null || sign == null || application == null) return false;

                var filePaths = new
                {
                    BeforeFilePath = (application.BeforeChangeFile != null) ? HttpContext.Current.Server.MapPath($"/Data/Files/{application.BeforeChangeFile}") : null,
                    AfterFilePath = (application.AfterChangeFile != null) ? HttpContext.Current.Server.MapPath($"/Data/Files/{application.AfterChangeFile}") : null,
                };
                var fileSizes = new
                {
                    BeforeFileSize = (filePaths.BeforeFilePath != null && File.Exists(filePaths.BeforeFilePath)) ? $"{((double)(new FileInfo(filePaths.BeforeFilePath).Length) / (1024 * 1024)):0.##} MB" : null,
                    AfterFileSize = (filePaths.AfterFilePath != null && File.Exists(filePaths.AfterFilePath)) ? $"{((double)(new FileInfo(filePaths.AfterFilePath).Length) / (1024 * 1024)):0.##} MB" : null,
                };

                // make sign url
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/MSC/SignManagement/DirectSign/?code=";
                string code = Common.StringToBase64Decode($"{application.Id},{sign.IdUser},{DateTime.Now}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", sign.User.Email);
                htmlBody = htmlBody.Replace("{DateCreated}", application.DateCreated?.ToString("yyyy-MM-dd HH:mm:ss"));
                htmlBody = htmlBody.Replace("{Subject}", Common.RemoveStringAccents(application.Subject));
                htmlBody = htmlBody.Replace("{UserCreated}", Common.CreateUserName(sign.User));
                htmlBody = htmlBody.Replace("{Process}", Common.RemoveStringAccents(application.Process));
                htmlBody = htmlBody.Replace("{Department}", R_PCN.GetApplicationDepartment(application.Id));
                htmlBody = htmlBody.Replace("{Model}", Common.RemoveStringAccents(application.Model));
                htmlBody = htmlBody.Replace("{BeforeChange}", Common.RemoveStringAccents(Common.UrlDecode(application.BeforeChange)));
                htmlBody = htmlBody.Replace("{AfterChange}", Common.RemoveStringAccents(Common.UrlDecode(application.AfterChange)));
                htmlBody = htmlBody.Replace("{BeforeChangeFile}", !string.IsNullOrEmpty(filePaths.BeforeFilePath) ? CreateDownloadElementPath(application.BeforeChangeFile, fileSizes.BeforeFileSize) : ".");
                htmlBody = htmlBody.Replace("{AfterChangeFile}", !string.IsNullOrEmpty(filePaths.AfterFilePath) ? CreateDownloadElementPath(application.AfterChangeFile, fileSizes.AfterFileSize) : ".");
                htmlBody = htmlBody.Replace("{Reason}", Common.RemoveStringAccents(Common.UrlDecode(application.Reason)));
                htmlBody = htmlBody.Replace("{CalcCost}", Common.RemoveStringAccents(Common.UrlDecode(application.CalcCost)));
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");


                // send email
                Common.SendEmail(new Email
                {
                    MailTo = sign.User.Email,
                    MailCC = IsSendBoss ? "you-nan.ruan@mail.foxconn.com" : "",
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


        private static string CreateDownloadElementPath(string filePath, string fileSize)
        {
            return $"<a href=\"{ConfigurationManager.AppSettings["SystemUrl"]}/Data/Files/{filePath}\">{filePath} ({fileSize})</a>";
        }
    }
}