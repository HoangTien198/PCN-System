using IE_MSC.Areas.Attributes;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Mvc;

namespace IE_MSC.Areas.User.Controllers
{
    [Authentication(IsAdmin = true)]
    public class ManagementController : Controller
    {
        // GET: User/Management

        public ActionResult Management()
        {
            return View();
        }

        /* GET */
        public async Task<JsonResult> GetUserInformation(string username)
        {
            try
            {
                string apiUrl = WebConfigurationManager.AppSettings["HR_API"];
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync($"{apiUrl}{username}");

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        return Json(new { status = true, data = jsonResponse }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return Json(new { status = false, message = response.StatusCode }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetUser(string Id)
        {
            try
            {
                var result = R_User.GetUser(Id);
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "User does not exists." }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetUsers()
        {
            try
            {
                var result = R_User.GetUsers();
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "User does not exists." }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetSessionUser()
        {
            try
            {
                var result = R_User.GetSessionUser();
                if (result != null)
                {
                    return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, data = result }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /* POST */
        public JsonResult CreateUser(Entities.User user)
        {
            try
            {
                var result = R_User.CreateUser(user);

                return Json(new { status = true, data = result });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        public JsonResult UpdateUser(Entities.User user)
        {
            try
            {
                var result = R_User.UpdateUser(user);

                return Json(new { status = true, data = result });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        public JsonResult DeleteUser(string IdUser)
        {
            try
            {
                var result = R_User.DeleteUser(IdUser);

                return Json(new { status = true, data = result });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
    }
}