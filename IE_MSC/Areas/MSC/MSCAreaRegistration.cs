using System.Web.Mvc;

namespace IE_MSC.Areas.MSC
{
    public class MSCAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "MSC";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "MSC_default",
                "MSC/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}