using System.Web.Mvc;

namespace IE_MSC.Areas.IE
{
    public class IEAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "IE";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "IE_default",
                "IE/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}