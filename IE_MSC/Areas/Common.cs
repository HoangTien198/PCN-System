using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace IE_MSC.Areas
{
    public class Common
    {
        public static Entities.User GetSessionUser()
        {
            try
            {
                var user = (Entities.User)HttpContext.Current.Session["UserSession"];

                if (user != null)
                {
                    return user;
                }
                else
                {
                    throw new Exception("Login session expired. Please relogin (F5).");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static string UrlDecode(string str)
        {
            try
            {
                return HttpUtility.UrlDecode(RemoveStringAccents(str));
            }
            catch (Exception ex)
            {
                return $"Decode Exception: {ex.Message}";
            }
        }
        public static void SendEmail(Email email)
        {
            try
            {
                Task.Run(() =>
                {
                    ServicePointManager.Expect100Continue = true;
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                    string inputJson = JsonSerializer.Serialize(email);
                    var client = new HttpClient();
                    var request = new HttpRequestMessage(HttpMethod.Post, ConfigurationManager.AppSettings["SendEmailAPI"]);
                    var content = new StringContent(inputJson, null, "application/json");
                    request.Content = content;
                    var response = client.SendAsync(request).Result;

                    if (response.EnsureSuccessStatusCode().StatusCode == HttpStatusCode.OK)
                    {
                        Debug.WriteLine("Send email OK");
                    }
                });

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
        }
        public static string ReadHtmlFileContent(string templateName)
        {
            string templatePath = Path.Combine(HttpContext.Current.Server.MapPath($"~/Areas/Shared/Emails/{templateName}.html"));
            if (File.Exists(templatePath))
            {
                string emailContent = File.ReadAllText(templatePath);
                return emailContent;
            }
            else
            {
                return string.Empty;
            }
        }
        public static string RemoveStringAccents(string input)
        {
            if (!string.IsNullOrEmpty(input))
            {
                const string FindText = "áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ";
                const string ReplText = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
                int index = -1;
                char[] arrChar = FindText.ToCharArray();
                while ((index = input.IndexOfAny(arrChar)) != -1)
                {
                    int index2 = FindText.IndexOf(input[index]);
                    input = input.Replace(input[index], ReplText[index2]);
                }
                return input;
            }
            else
            {
                return string.Empty;
            }

        }
        public static string StringToBase64Decode(string base64String)
        {
            try
            {
                byte[] data = Convert.FromBase64String(base64String);
                return Encoding.UTF8.GetString(data);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error decoding base64 string: " + ex.Message);
                return null;
            }
        }
        public static string StringToBase64Encode(string plainText)
        {
            try
            {
                byte[] data = Encoding.UTF8.GetBytes(plainText);
                return Convert.ToBase64String(data);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error encoding string to base64: " + ex.Message);
                return null;
            }
        }
        public static string CreateUserName(Entities.User user)
        {
            try
            {
                if (!string.IsNullOrEmpty(user.VnName))
                {
                    return $"{user.CardId} - {user.VnName}";
                }
                else if (!string.IsNullOrEmpty(user.CnName))
                {
                    return $"{user.CardId} - {user.CnName}";
                }
                else
                {
                    return $"{user.CardId}";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
    public class Email
    {
        public string MailTo { get; set; }
        public string MailCC { get; set; }
        public string MailSubject { get; set; }
        public string MailContent { get; set; }
        public string MailType { get; set; }
    }
}