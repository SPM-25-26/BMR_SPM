using System.Net.Mail;

namespace eppoi.Server.Options
{
    public class SmtpOptions
    {
        public string User { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Client { get; set; } = string.Empty;
        public int Port { get; set; } = 587;

    }
}
