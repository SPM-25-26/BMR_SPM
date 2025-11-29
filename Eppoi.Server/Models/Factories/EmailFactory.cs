using eppoi.Server.Models.Responses;
using Eppoi.Server.Models;
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
                email = user.Email!,
                title = "Welcome to Eppoi!",
                body = body
            };
            return email;
        }

        public static Email Confirmation(User user, string token)
        {
            string body = LoadEmbeddedTemplate("eppoi.Server.EmailTemplates.Confirmation.html")
                .Replace("{{Name}}", user.Name)
                .Replace("{{Token}}", token);

            Email email = new()
            {
                email = user.Email!,
                title = "Eppoi Email Confirmation",
                body = body
            };
            return email;
        }

        public static Email PasswordReset(User user, string token)
        {
            string body = LoadEmbeddedTemplate("eppoi.Server.EmailTemplates.PasswordReset.html")
                .Replace("{{Name}}", user.Name)
                .Replace("{{Token}}", token);

            Email email = new()
            {
                email = user.Email!,
                title = "Eppoi Password Reset",
                body = body
            };
            return email;
        }

        private static string LoadEmbeddedTemplate(string resourceName)
        {
            using (Stream? stream = ExecutingAssembly.GetManifestResourceStream(resourceName))
            {
                if (stream == null)
                    throw new FileNotFoundException($"Template not found: {resourceName}");
                
                using (StreamReader reader = new(stream))
                {
                    return reader.ReadToEnd();
                }
            }
        }
    }
}
