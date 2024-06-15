using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas
{
    public class AuthenticationController : Controller
    {
        // GET: Authentication
        public ActionResult Index()
        {
            if (Request.Cookies["RememberLogin"] != null)
            {
                string value = Request.Cookies["RememberLogin"].Value;
                var user = UnHashValue(value);
                if (user != null)
                {
                    CreateSession(user);
                    CreateCookieInfo(user);

                    return Redirect(Url.Action("Index", "Dashboard", new { area = "Dashboard" }));
                }
                else
                {
                    DeleteCookie("RememberLogin");
                    return View();
                }
            }
            else
            {
                return View();
            }
        }
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult LoginNormal(string Username, string Password, bool remember = false)
        {
            try
            {
                var user = R_User.GetUser(Username, Password);
                CreateSession(user);
                CreateCookieInfo(user);

                if (remember)
                {
                    CreateCookieRemember(user);
                }

                return RedirectToAction("Index", "Dashboard", new { area = "Dashboard" });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return View("Index");
            }
        }
        public ActionResult LoginSmartOffice()
        {
            try
            {
                string code = Request.Params["code"];
                


                var jwtSecurityToken = new JwtSecurityTokenHandler().ReadJwtToken(code);

                var username = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == "username").Value;
                Session["OauthCode"] = code;

                var user = R_User.GetUser(username, true);

                LoginNormal(user.Username, user.Password, false);
                return RedirectToAction("Index", "DashboardManagement", new { area = "Dashboard" });
            }
            catch (Exception)
            {
                return RedirectToAction("Login", "Authentication");
            }
        }

        public ActionResult LogoutNormal()
        {
            DeleteSession();
            DeleteCookie("RememberLogin");
            DeleteCookie("UserInfo");

            return Redirect(Url.Action("Index", "Authentication"));
        }

        /* Cookies */
        private void CreateCookieInfo(Entities.User user)
        {
            HttpCookie rememberSignInCookie = new HttpCookie("UserInfo");

            rememberSignInCookie["Username"] = user.Username;

            rememberSignInCookie.Expires = DateTime.Now.AddDays(15);

            Response.Cookies.Add(rememberSignInCookie);
        }
        private void CreateCookieRemember(Entities.User user)
        {
            HttpCookie rememberSignInCookie = new HttpCookie("RememberLogin")
            {
                Value = NewHashValue($"{user.Username}|{user.Password}"),
                Expires = DateTime.Now.AddDays(15)
            };
            Response.Cookies.Add(rememberSignInCookie);
        }

        /* Session */
        private void CreateSession(Entities.User user)
        {
            Session["UserSession"] = user;
        }
        private void DeleteSession()
        {
            Session["UserSession"] = null;
            Session.Clear();
            Session.Abandon();
        }

        /* HASH */
        private string NewHashValue(string value)
        {
            return Convert.ToBase64String(Protect(Encoding.UTF8.GetBytes(value), Encoding.UTF8.GetBytes("ProtectKey")));
        }
        private Entities.User UnHashValue(string value)
        {
            try
            {
                var unprotectedData = Encoding.UTF8.GetBytes("ProtectKey");
                var protectedData = Convert.FromBase64String(value);

                var decryptedData = Unprotect(protectedData, unprotectedData);

                var decryptedString = Encoding.UTF8.GetString(decryptedData);

                var userInfo = decryptedString.Split('|');

                if (userInfo.Length == 2)
                {
                    var username = userInfo[0];
                    var password = userInfo[1];

                    var user = R_User.GetUser(username, password, true);
                    return user;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
        private static byte[] Protect(byte[] data, byte[] entropy)
        {
            return ProtectedData.Protect(data, entropy, DataProtectionScope.CurrentUser);
        }
        private static byte[] Unprotect(byte[] data, byte[] entropy)
        {
            return ProtectedData.Unprotect(data, entropy, DataProtectionScope.CurrentUser);
        }

        private void DeleteCookie(string cookieName)
        {
            Response.Cookies[cookieName].Expires = DateTime.Now.AddDays(-1);
        }
    }
}