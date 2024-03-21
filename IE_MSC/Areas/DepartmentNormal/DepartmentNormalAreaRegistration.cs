using System.Web.Mvc;

namespace IE_MSC.Areas.DepartmentNormal
{
    public class DepartmentNormalAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "DepartmentNormal";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "DepartmentNormal_default",
                "DepartmentNormal/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}