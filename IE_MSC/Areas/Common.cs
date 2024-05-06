using IE_MSC.Areas.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace IE_MSC.Areas
{
    public class Common
    {
        public static Employee_ GetSessionUser()
        {
			try
			{
				var user = (Employee_)HttpContext.Current.Session["UserSession"];

				if (user != null)
				{
					return user;
				}
				else
				{
					return null;
				}
			}
			catch (Exception ex)
			{
				throw ex;
			}
        }
    }
}