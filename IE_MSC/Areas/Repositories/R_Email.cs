using IE_MSC.Areas.Entities;
using System;
using System.Configuration;
using System.IO;
using System.Web;

namespace IE_MSC.Areas
{
    internal class R_Emails
    {
        public static bool SendSignRequestEmail(Entities.Application application, Entities.User user)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSignRequest");

                if (string.IsNullOrEmpty(user.Email)) return false;
                if (htmlBody == null || user == null || application == null) return false;

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
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/Sign/Management/DirectSign/?code=";
                string code = Common.StringToBase64Encode($"{application.Id},{user.Id}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", user.Email);
                htmlBody = htmlBody.Replace("{DateCreated}", application.DateCreated?.ToString("yyyy-MM-dd HH:mm:ss"));
                htmlBody = htmlBody.Replace("{Subject}", Common.RemoveStringAccents(application.Subject));
                htmlBody = htmlBody.Replace("{UserCreated}", Common.CreateUserName(application.UserCreated));
                htmlBody = htmlBody.Replace("{Process}", Common.RemoveStringAccents(application.Process));
                htmlBody = htmlBody.Replace("{Department}", R_PCN.GetApplicationDepartment(application));
                htmlBody = htmlBody.Replace("{Model}", Common.RemoveStringAccents(application.Model));
                htmlBody = htmlBody.Replace("{BeforeChange}", Common.RemoveStringAccents(Common.UrlDecode(application.BeforeChange)));
                htmlBody = htmlBody.Replace("{AfterChange}", Common.RemoveStringAccents(Common.UrlDecode(application.AfterChange)));
                htmlBody = htmlBody.Replace("{BeforeChangeFile}", !string.IsNullOrEmpty(filePaths.BeforeFilePath) ? CreateDownloadElementPath(application.BeforeChangeFile, fileSizes.BeforeFileSize) : ".");
                htmlBody = htmlBody.Replace("{AfterChangeFile}", !string.IsNullOrEmpty(filePaths.AfterFilePath) ? CreateDownloadElementPath(application.AfterChangeFile, fileSizes.AfterFileSize) : ".");
                htmlBody = htmlBody.Replace("{Reason}", Common.RemoveStringAccents(Common.UrlDecode(application.Reason)));
                htmlBody = htmlBody.Replace("{CalcCost}", Common.RemoveStringAccents(Common.UrlDecode(application.CalcCost)));
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");

                var IsDebug = bool.Parse(ConfigurationManager.AppSettings["IsDebugEmail"]);

                // send email
                Common.SendEmail(new Email
                {
                    MailTo = IsDebug ? ConfigurationManager.AppSettings["DebugEmail"] : user.Email,
                    MailCC = "",
                    MailSubject = $"【 PCN SYSTEM 】New sign request.",
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
        public static bool SendBossEmail(Entities.Application application)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSendBoss");
                var IdBoss = ConfigurationManager.AppSettings["IdBoss"];
                var boss = R_User.GetUser(IdBoss);

                if (string.IsNullOrEmpty(boss.Email)) return false;
                if (htmlBody == null || boss == null || application == null) return false;

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
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/Sign/Management/DirectSign/?code=";
                string code = Common.StringToBase64Encode($"{application.Id},{boss.Id}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", boss.Email);
                htmlBody = htmlBody.Replace("{DateCreated}", application.DateCreated?.ToString("yyyy-MM-dd HH:mm:ss"));
                htmlBody = htmlBody.Replace("{Subject}", Common.RemoveStringAccents(application.Subject));
                htmlBody = htmlBody.Replace("{UserCreated}", Common.CreateUserName(application.UserCreated));
                htmlBody = htmlBody.Replace("{Process}", Common.RemoveStringAccents(application.Process));
                htmlBody = htmlBody.Replace("{Department}", R_PCN.GetApplicationDepartment(application));
                htmlBody = htmlBody.Replace("{Model}", Common.RemoveStringAccents(application.Model));
                htmlBody = htmlBody.Replace("{BeforeChange}", Common.RemoveStringAccents(Common.UrlDecode(application.BeforeChange)));
                htmlBody = htmlBody.Replace("{AfterChange}", Common.RemoveStringAccents(Common.UrlDecode(application.AfterChange)));
                htmlBody = htmlBody.Replace("{BeforeChangeFile}", !string.IsNullOrEmpty(filePaths.BeforeFilePath) ? CreateDownloadElementPath(application.BeforeChangeFile, fileSizes.BeforeFileSize) : ".");
                htmlBody = htmlBody.Replace("{AfterChangeFile}", !string.IsNullOrEmpty(filePaths.AfterFilePath) ? CreateDownloadElementPath(application.AfterChangeFile, fileSizes.AfterFileSize) : ".");
                htmlBody = htmlBody.Replace("{Reason}", Common.RemoveStringAccents(Common.UrlDecode(application.Reason)));
                htmlBody = htmlBody.Replace("{CalcCost}", Common.RemoveStringAccents(Common.UrlDecode(application.CalcCost)));
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");

                var IsDebug = bool.Parse(ConfigurationManager.AppSettings["IsDebugEmail"]);

                // send email
                Common.SendEmail(new Email
                {
                    MailTo = IsDebug ? ConfigurationManager.AppSettings["DebugEmail"] : boss.Email,
                    MailCC = "",
                    MailSubject = $"【 PCN SYSTEM 】New PCN application.",
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
        public static bool SendAdminEmail(Entities.Application application)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSendBoss");
                var IdAdmin = ConfigurationManager.AppSettings["IdAdmin"];
                var admin = R_User.GetUser(IdAdmin);

                if (string.IsNullOrEmpty(admin.Email)) return false;
                if (htmlBody == null || admin == null || application == null) return false;

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
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/Sign/Management/DirectSign/?code=";
                string code = Common.StringToBase64Encode($"{application.Id},{admin.Id}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", admin.Email);
                htmlBody = htmlBody.Replace("{DateCreated}", application.DateCreated?.ToString("yyyy-MM-dd HH:mm:ss"));
                htmlBody = htmlBody.Replace("{Subject}", Common.RemoveStringAccents(application.Subject));
                htmlBody = htmlBody.Replace("{UserCreated}", Common.CreateUserName(application.UserCreated));
                htmlBody = htmlBody.Replace("{Process}", Common.RemoveStringAccents(application.Process));
                htmlBody = htmlBody.Replace("{Department}", R_PCN.GetApplicationDepartment(application));
                htmlBody = htmlBody.Replace("{Model}", Common.RemoveStringAccents(application.Model));
                htmlBody = htmlBody.Replace("{BeforeChange}", Common.RemoveStringAccents(Common.UrlDecode(application.BeforeChange)));
                htmlBody = htmlBody.Replace("{AfterChange}", Common.RemoveStringAccents(Common.UrlDecode(application.AfterChange)));
                htmlBody = htmlBody.Replace("{BeforeChangeFile}", !string.IsNullOrEmpty(filePaths.BeforeFilePath) ? CreateDownloadElementPath(application.BeforeChangeFile, fileSizes.BeforeFileSize) : ".");
                htmlBody = htmlBody.Replace("{AfterChangeFile}", !string.IsNullOrEmpty(filePaths.AfterFilePath) ? CreateDownloadElementPath(application.AfterChangeFile, fileSizes.AfterFileSize) : ".");
                htmlBody = htmlBody.Replace("{Reason}", Common.RemoveStringAccents(Common.UrlDecode(application.Reason)));
                htmlBody = htmlBody.Replace("{CalcCost}", Common.RemoveStringAccents(Common.UrlDecode(application.CalcCost)));
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");

                var IsDebug = bool.Parse(ConfigurationManager.AppSettings["IsDebugEmail"]);

                // send email
                Common.SendEmail(new Email
                {
                    MailTo = IsDebug ? ConfigurationManager.AppSettings["DebugEmail"] : admin.Email,
                    MailCC = "",
                    MailSubject = $"【 PCN SYSTEM 】New PCN application.",
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

        public static bool SendApproveEmail(Entities.Application application, Entities.User user)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSignApproved");

                if (string.IsNullOrEmpty(user.Email)) return false;
                if (htmlBody == null || user == null || application == null) return false;

                // make sign url
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/Sign/Management/DirectSign/?code=";
                string code = Common.StringToBase64Encode($"{application.Id},{user.Id}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", user.Email);
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");

                var IsDebug = bool.Parse(ConfigurationManager.AppSettings["IsDebugEmail"]);

                // send email
                Common.SendEmail(new Email
                {
                    MailTo = IsDebug ? ConfigurationManager.AppSettings["DebugEmail"] : user.Email,
                    MailCC = "",
                    MailSubject = $"【 PCN SYSTEM 】Your PCN application has been approved.",
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
        public static bool SendRejectEmail(Entities.Application application, Entities.User user)
        {
            try
            {
                string htmlBody = Common.ReadHtmlFileContent("ApplicationSignRejected");

                if (string.IsNullOrEmpty(user.Email)) return false;
                if (htmlBody == null || user == null || application == null) return false;

                // make sign url
                string url = $"{ConfigurationManager.AppSettings["SystemUrl"]}/Sign/Management/DirectSign/?code=";
                string code = Common.StringToBase64Encode($"{application.Id},{user.Id}");

                // make content
                htmlBody = htmlBody.Replace("{SystemName}", ConfigurationManager.AppSettings["SystemName"]);
                htmlBody = htmlBody.Replace("{ToEmail}", user.Email);
                htmlBody = htmlBody.Replace("{LinkSign}", $"{url}{code}");

                var IsDebug = bool.Parse(ConfigurationManager.AppSettings["IsDebugEmail"]);

                // send email
                Common.SendEmail(new Email
                {
                    MailTo = IsDebug ? ConfigurationManager.AppSettings["DebugEmail"] : user.Email,
                    MailCC = "",
                    MailSubject = $"【 PCN SYSTEM 】Your PCN application has been rejected.",
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