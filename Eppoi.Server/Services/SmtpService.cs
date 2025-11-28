using eppoi.Server.Models;
using eppoi.Server.Models.Factories;
using eppoi.Server.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Mail;

namespace eppoi.Server.Services
{
    public class SmtpService(IOptions<SmtpOptions> options)
    {

        private readonly SmtpOptions _options = options.Value;

        public void SendMail(Email request)
        {
            var client = new SmtpClient(_options.Client, _options.Port)
            {
                Credentials = new NetworkCredential(_options.User, _options.Password),
                EnableSsl = true
            };

            client.Send("test@test.it", request.email, request.title, request.body);
            System.Console.WriteLine("Sent");
        }
    }
}
