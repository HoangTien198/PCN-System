﻿using IE_MSC.Commons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IE_MSC.Areas.Boss.Controllers
{
    public class BaseBossController : Controller
    {
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var session = (AccountLogin)Session[CommonConstant.USER_SESSION];
            if (session == null)
            {
                filterContext.Result = new RedirectResult("/Home/Index");
                return;
            }
            else
            {
                if (session.ViewLogin != 1)
                {
                    filterContext.Result = new RedirectResult("/ErrorPage/Error404");
                    return;
                }
            }
            base.OnActionExecuted(filterContext);
        }
    }
}