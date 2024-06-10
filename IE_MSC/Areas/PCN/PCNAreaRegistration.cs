using System.Web.Mvc;

namespace IE_MSC.Areas.PCN
{
    public class PCNAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "PCN";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "PCN_default",
                "PCN/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}