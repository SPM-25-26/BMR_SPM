using eppoi.Models.Entities;
using eppoi.Server.Models.Authentication;
using System.Reflection;

namespace eppoi.Server.Models.Factories
{
    public class EmailFactory
    {
        private static readonly Assembly ExecutingAssembly = Assembly.GetExecutingAssembly();

        public static Email Registration(User user)
        {
            string body = LoadEmbeddedTemplate("eppoi.Server.EmailTemplates.Registration.html")
                .Replace("{{Name}}", user.Name);

            Email email = new()
            {
                Reciever = user.Email!,
                Title = "Welcome to Eppoi!",
                Body = body
            };
            return email;
        }

        public static Email Confirmation(User user, string token)
        {
            string body = LoadEmbeddedTemplate("eppoi.Server.EmailTemplates.Confirmation.html")
                .Replace("{{Name}}", user.Name)
                .Replace("{{UserId}}", Uri.EscapeDataString(user.Id))
                .Replace("{{Token}}", Uri.EscapeDataString(token));

            Email email = new()
            {
                Reciever = user.Email!,
                Title = "Eppoi Email Confirmation",
                Body = body
            };
            return email;
        }

        public static Email PasswordReset(User user, string token)
        {
            string body = LoadEmbeddedTemplate("eppoi.Server.EmailTemplates.PasswordReset.html")
                .Replace("{{Name}}", user.Name)
                .Replace("{{UserId}}", Uri.EscapeDataString(user.Id))
                .Replace("{{Token}}", Uri.EscapeDataString(token));

            Email email = new()
            {
                Reciever = user.Email!,
                Title = "Eppoi Password Reset",
                Body = body
            };
            return email;
        }

        private static string LoadEmbeddedTemplate(string resourceName)
        {
            using Stream? stream = ExecutingAssembly.GetManifestResourceStream(resourceName) 
                ?? throw new FileNotFoundException($"Template not found: {resourceName}");
            using StreamReader reader = new(stream);

            // Remove newlines character in order to prevent mail viewers like Gmail to interpret them as HTML <br>
            return reader.ReadToEnd().Replace("\n", "").Replace("\r", "");
        }
    }
}
