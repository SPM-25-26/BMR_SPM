using eppoi.Server.Models.Responses;
using Eppoi.Server.Models;

namespace eppoi.Server.Models.Factories
{
    public class EmailFactory
    {
        public static Email Registration(User user)
        {
            Email email = new()
            {
                email = user.Email!,
                title = "Welcome to Eppoi!",
                body = $"Hello {user.Name},\n\nThank you for registering at Eppoi. We're excited to have you on board!\n\nBest regards,\nThe Eppoi Team"
            };
            return email;
        }

        public static Email Confirmation(User user, string token)
        {
            Email email = new()
            {
                email = user.Email!,
                title = "Eppoi Email Confirmation",
                body = $"Hello {user.Name},\n\nPlease confirm your email address by using the following token:\n\n{token}\n\nBest regards,\nThe Eppoi Team"
            };
            return email;
        }

        public static Email PasswordReset(User user, string token)
        {
            Email email = new()
            {
                email = user.Email!,
                title = "Eppoi Password Reset",
                body = $"Hello {user.Name},\n\nYou can reset your password by using the following token:\n\n{token}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Eppoi Team"
            };
            return email;
        }
    }
}
