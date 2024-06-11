using System;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class Authentication : AuthorizeAttribute
    {
        public bool AllowAnonymous { get; set; } = false;
        public bool IsAdmin { get; set; } = false;

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            Entities.User user = (Entities.User)HttpContext.Current.Session["UserSession"];
            string NextUrl = httpContext.Request.RawUrl.ToString();
            var IsAjax = IsAjaxRequest(httpContext.Request);


            // Nếu không chấp nhận Anonymous
            if (!AllowAnonymous)
            {
                // Nêu có session user
                if (user != null)
                {
                    // Nếu yêu cầu quyền
                    if (IsAdmin)
                    {
                        if ((bool)user.IsAdmin) return true;
                        else return false;
                    }
                    else
                    {
                        if (IsAjax) return true;
                        else
                        {
                            HttpContext.Current.Session["PrevUrl"] = NextUrl;
                            return true;
                        }
                    }
                }
                else
                {
                    HttpContext.Current.Session["PrevUrl"] = "/Authentication/Index";
                    return false;
                }
            }
            else
            {
                if (IsAjax) return true;
                else
                {
                    HttpContext.Current.Session["PrevUrl"] = NextUrl;
                    return true;
                }
            }
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            string PrevUrl = HttpContext.Current.Session["PrevUrl"]?.ToString();
            if (PrevUrl != null)
            {
                filterContext.Result = new RedirectResult(PrevUrl);
            }
            else
            {
                filterContext.Result = new RedirectResult("~/Dashboard/Dashboard");
            }

        }
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
        }

        public static bool IsAjaxRequest(HttpRequestBase request)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }

            if (request.Headers != null)
            {
                return request.Headers["X-Requested-With"] == "XMLHttpRequest";
            }

            return false;
        }
    }
}