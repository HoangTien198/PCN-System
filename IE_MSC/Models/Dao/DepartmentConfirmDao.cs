//using IE_MSC.Commons;
//using IE_MSC.Models.Entities;
//using IE_MSC.Models.ViewModel;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;

//namespace IE_MSC.Models.Dao
//{
//    public class DepartmentConfirmDao
//    {
//        private PCNDbContext db = null;
//        public DepartmentConfirmDao()
//        {
//            db = new PCNDbContext();
//        }

//        public DepartmentConfirmVM GetByPrimaryKey(string MSCID, string departmentID)
//        {
//            try
//            {
//                var dept = db.DepartmentConfirms.FirstOrDefault(dc => dc.MSCID == MSCID && dc.DepartmentID == departmentID);
//                return new DepartmentConfirmVM
//                {
//                    DepartmentID = dept.DepartmentID,
//                    DepartmentName= dept.Department.DepartmentName,
//                    MSCID = dept.MSCID,
//                    ConfirmedBy = dept.ConfirmedBy,
//                    ConfirmedDate = dept.ConfirmedDate,
//                    ReasonReject = dept.ReasonReject,
//                    RejectedBy = dept.RejectedBy,
//                    RejectedDate = dept.RejectedDate,
//                    Status = dept.Status
//                };
//            }
//            catch (Exception)
//            {
//                return null;
//            }
           
//        }

//        /// <summary>
//        /// Bấm ký đơn của mỗi phòng ban
//        /// </summary>
//        /// <param name="MSCID">ID của MSC</param>
//        /// <param name="DepartmentID">ID của phòng ban</param>
//        /// <param name="userLogin">Người đang đăng nhập</param>
//        /// <returns></returns>
//        public int ConfirmMSC(string MSCID, string DepartmentID,AccountLogin userLogin)
//        {
//            try
//            {
//                var dept = db.Departments.FirstOrDefault(d => d.DepartmentID == DepartmentID);
//                // lấy ra mã thẻ của trưởng phòng: 
//                var empCodeDept = db.Employees.FirstOrDefault(e => e.DepartmentId == DepartmentID && e.Position == 1);
//                if (dept.DepartmentID != "87df1b2e-d667-45e9-be55-86a441441ce8" && dept.DepartmentID != "6958fff6-5bb0-42b7-bf68-19eb232b9342")//không phải IE
//                {
//                    if (dept.DepartmentID == "0fae23fc-2e43-48b4-806a-06af3d8928ca")//boss
//                    {
//                        var msc = db.MSCs.FirstOrDefault(m => m.MSCID == MSCID);
//                        msc.Status = 5;//Approved
//                        msc.BossConfirmBy = userLogin.EmployeeID;
//                        msc.BossConfirmDate = DateTime.Now;
//                        msc.EffectiveDate = DateTime.Now;
//                        db.SaveChanges();
//                        return 1;//thành công
//                    }
//                    else//department normal
//                    {

//                        if (userLogin.EmployeeCode.Trim() == empCodeDept.EmployeeCode.Trim() && userLogin.DepartmentType.Trim().ToUpper() == dept.Type.Trim().ToUpper())
//                        {
//                            if (userLogin.Position == 1)
//                            {
//                                var deptc = db.DepartmentConfirms.FirstOrDefault(dc => dc.DepartmentID == DepartmentID && dc.MSCID == MSCID);
//                                deptc.Status = 2;
//                                deptc.ConfirmedBy = userLogin.EmployeeID;
//                                deptc.ConfirmedDate = DateTime.Now;
//                                db.SaveChanges();
//                                return 1;//thành công
//                            }
//                            else
//                            {
//                                return 0;// không có quyền kí
//                            }
//                        }
//                        else
//                        {
//                            return 0;//không có quyền kí
//                        }
//                    }
//                }
//                else
//                {
//                    //kiểm tra người ký có phải là IE hay không:
//                    if (userLogin.DepartmentName.Trim() == dept.DepartmentName.Trim())
//                    {
//                        if (userLogin.Position == 1)//IE Leader
//                        {
//                            var deptc = db.DepartmentConfirms.FirstOrDefault(dc => dc.DepartmentID == DepartmentID && dc.MSCID == MSCID);
//                            deptc.Status = 2;
//                            deptc.ConfirmedBy = userLogin.EmployeeID;
//                            deptc.ConfirmedDate = DateTime.Now;
//                            db.SaveChanges();
//                            if (checkIELeaderConfirm(MSCID)==true)
//                            {
//                                var msc = db.MSCs.FirstOrDefault(m => m.MSCID == MSCID);
//                                msc.Status = 4;// Sếp IE đã xác nhận, chờ sếp Cao xác nhận
//                                msc.IEConfirmBy = userLogin.EmployeeID;
//                                msc.IEConfirmDate = DateTime.Now;
//                                #region Gửi mail cho sếp cao
//                                var mscDao = new MSCDao();
//                                mscDao.SendMailMSC(MSCID, "dai-xin.gao@mail.foxconn.com");
//                                #endregion
//                                db.SaveChanges();
//                                return 1;//thành công

//                            }
//                            else
//                            {
//                                var msc = db.MSCs.FirstOrDefault(m => m.MSCID == MSCID);
//                                msc.Status = 3;// Sếp IE chưa xác nhận xong(xác nhận cho 2 phòng IE)
//                                #region Gửi mail cho sếp IE
//                                var mscDao = new MSCDao();
//                                mscDao.SendMailMSC(MSCID, "paolo.wd.li@mail.foxconn.com");
//                                #endregion
//                                msc.IEConfirmBy = userLogin.EmployeeID;
//                                msc.IEConfirmDate = DateTime.Now;
//                                db.SaveChanges();
//                                return 1;//thành công
//                            }
//                        }
//                        else
//                        {
//                            return 0;// không có quyền kí
//                        }
//                    }
//                    else
//                    {
//                        return 0;// không có quyền kí
//                    }
//                }
                
//            }
//            catch (Exception)
//            {

//                return -1;//server error
//            }
//        }
    
//        /// <summary>
//        /// Check: -1: reject , 0: chưa xong , 1: ok, 2: chờ IE Calculate
//        /// </summary>
//        /// <param name="MSCID"></param>
//        /// <returns></returns>
//        public int checkAllDeptNormalSigned(string MSCID)
//        {
//            var countOK = 0;
//            var deptConfirms = db.DepartmentConfirms.Where(dc => dc.MSCID == MSCID && (dc.DepartmentID != "87df1b2e-d667-45e9-be55-86a441441ce8" && dc.DepartmentID != "6958fff6-5bb0-42b7-bf68-19eb232b9342"));
//            foreach (var item in deptConfirms)
//            {
//                if (item.Status == -1)
//                {
//                    return -1;
//                }
//                if (item.Status == 2)
//                {
//                    countOK++;
//                }
//            }
//            if (countOK == deptConfirms.ToList().Count)
//            {
//                var msc = db.MSCs.FirstOrDefault(m => m.MSCID == MSCID && m.Status != -1);
//                msc.Status = 2;//Chờ IE calculate

//                // Gửi mail:
//                var dc = db.DepartmentConfirms.Where(s => s.MSCID == MSCID);
//                var mscDao = new MSCDao();
//                foreach (var item in dc)
//                {
//                    if (item.DepartmentID == "87df1b2e-d667-45e9-be55-86a441441ce8")//IE Arlo
//                    {
//                        var users = db.Employees.Where(u => u.DepartmentId == "87df1b2e-d667-45e9-be55-86a441441ce8" && u.Position == 2);//Nhân viên
//                        foreach (var u in users)
//                        {
//                            mscDao.SendMailMSC(MSCID, u.Email);
                            
//                        }
//                    }
//                    if (item.DepartmentID == "6958fff6-5bb0-42b7-bf68-19eb232b9342")//IE Netgear
//                    {
//                        var users = db.Employees.Where(u => u.DepartmentId == "6958fff6-5bb0-42b7-bf68-19eb232b9342" && u.Position == 2);//Nhân viên
//                        foreach (var u in users)
//                        {
//                            mscDao.SendMailMSC(MSCID, u.Email);

//                        }
//                    }
//                }
                
//                db.SaveChanges();
//                return 1;//ok
//            }
//            else
//            {
//                return 0;//chưa kí xong
//            }
//        }

//        /// <summary>
//        /// Hàm kiểm tra đơn MSC đã được IE Leader confirm hay chưa
//        /// </summary>
//        /// <param name="MSCID">ID của đơn MSC</param>
//        /// <returns>true: đã ký hết| false: chưa ký hết</returns>
//        public bool checkIELeaderConfirm(string MSCID)
//        {
//            try
//            {
//                var countCF = 0;
//                var deptIEConfirm = db.DepartmentConfirms.Where(dc => (dc.MSCID == MSCID && dc.DepartmentID == "87df1b2e-d667-45e9-be55-86a441441ce8") || (dc.MSCID==MSCID && dc.DepartmentID == "6958fff6-5bb0-42b7-bf68-19eb232b9342"));
//                var countPending = deptIEConfirm.Count();
//                foreach (var item in deptIEConfirm)
//                {
//                    if (item.Status == 2)
//                    {
//                        countCF++;
//                    }
//                }
//                if (countCF == countPending)
//                {
//                    return true;
//                }
//                else
//                {
//                    return false;
//                }
//            }
//            catch (Exception)
//            {
//                return false;
//            }
            
//        }
//    }
//}