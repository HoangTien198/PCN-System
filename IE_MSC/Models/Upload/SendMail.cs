using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IE_MSC.Models.Upload
{
    public class SendMail
    {
        public string MailTo { get; set; }
        public string MailCC { get; set; }
        public string MailSubject { get; set; }
        public string MailContent { get; set; }
        public string MailType { get; set; }//html,text
    }
}