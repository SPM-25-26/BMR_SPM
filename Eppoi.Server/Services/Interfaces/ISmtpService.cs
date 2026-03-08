using eppoi.Server.Models.Authentication;

namespace eppoi.Server.Services.Interfaces
{
    public interface ISmtpService
    {
        public void SendMail(Email request);
    }
}
