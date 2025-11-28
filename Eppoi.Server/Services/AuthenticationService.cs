using Azure.Core;
using eppoi.Server.Models;
using eppoi.Server.Models.Dto;
using eppoi.Server.Models.Factories;
using Eppoi.Server.Models;
using Eppoi.Server.Models.Dto;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Query;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;

namespace eppoi.Server.Services
{
    public class AuthenticationService(UserManager<User> userService, TokenService tokenService, SmtpService smtpService)
    {
        private readonly UserManager<User> _userManager = userService;
        private readonly TokenService _tokenService = tokenService;
        private readonly SmtpService _smtpService = smtpService;

        public async Task<IdentityResult> CreateUser(UserDto request)
        {
            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                Name = request.Name,
                CreatedDate = DateTime.UtcNow
            };

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);
            var result = await _userManager.CreateAsync(user, request.Password);

            Email email = EmailFactory.Registration(user);
            _smtpService.SendMail(email);

            return result;
        }

        public async Task<string> ValidateUser(Login request)
        {
            User? user;

            if (request.UserOrEmail.Contains('@'))
            { user = await _userManager.FindByEmailAsync(request.UserOrEmail); }
            else
            { user = await _userManager.FindByNameAsync(request.UserOrEmail); }

            if (user == null) return "";

            if (!await _userManager.IsEmailConfirmedAsync(user)) return "Confirm";

            var isPasswordValid = user != null && await _userManager.CheckPasswordAsync(user, request.Password);

            var result = _tokenService.CreateToken(isPasswordValid, user);
            return result;
        }

        public async Task<IdentityResult> ConfirmEmail(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return IdentityResult.Failed();
            var result = await _userManager.ConfirmEmailAsync(user, token);
            return result;
        }


        public async Task<string> SendVerificationEmail(string request)
        {
            User? user;

            if (request.Contains('@'))
            { user = await _userManager.FindByEmailAsync(request); }
            else
            { user = await _userManager.FindByNameAsync(request); }

            if (user == null) return "";

            var result = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            return result + "\n" + user.Name;
        }

        public async Task<string> SendPasswordResetEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return "";
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return token;
        }
        public async Task<IdentityResult> ResetPassword(PasswordResetDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) return IdentityResult.Failed();
            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            return result;
        }

        public async Task<IdentityResult?> GoogleLogin(ClaimsPrincipal claim)
        {
            if (claim == null) return null;

            var email = claim.FindFirstValue(ClaimTypes.Email);
            if (email == null) return null;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) 
            { 
                var User = new User
                {
                    UserName = email,
                    Email = email,
                    Name = claim.FindFirstValue(ClaimTypes.Name) ?? String.Empty,
                    CreatedDate = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(User);
                return result;
            }

            var info = new UserLoginInfo("Google", claim.FindFirstValue(ClaimTypes.Email) ?? String.Empty, "Google");
            var loginResult = await _userManager.AddLoginAsync(user, info);

            return loginResult;
        }
    }
}
