using eppoi.Server.Models.Authentication;
using eppoi.Server.Options;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace eppoi.Server.Services
{
    public class SmtpService(IOptions<SmtpOptions> options)
    {

        private readonly SmtpOptions _options = options.Value;

        public void SendMail(Email request)
        {
            var client = new SmtpClient(_options.Host, _options.Port)
            {
                Credentials = new NetworkCredential(_options.User, _options.Password),
                EnableSsl = true
            };

            client.Send("test@test.it", request.Reciever, request.Title, request.Body);
            System.Console.WriteLine("Sent");
        }
    }
}
