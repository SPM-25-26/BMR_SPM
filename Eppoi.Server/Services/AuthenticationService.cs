using eppoi.Models.Entities;
using eppoi.Server.Models.Authentication;
using eppoi.Server.Models.Authentication.Dto;
using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Responses;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;


namespace eppoi.Server.Services
{
    public class AuthenticationService(UserManager<User> userService, TokenService tokenService, SmtpService smtpService)
    {
        private readonly UserManager<User> _userManager = userService;
        private readonly TokenService _tokenService = tokenService;
        private readonly SmtpService _smtpService = smtpService;

        private readonly string _googleUserInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        private readonly string _facebookUserInfoUrl = "https://graph.facebook.com/debug_token";

        public async Task<IdentityResult> CreateUser(UserDto request)
        {
            Preferences pref = 0;
            pref = request.Preferences.Aggregate(pref, (current, pref) => current | pref);
            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                Name = request.Name,
                Preferences = pref
            };

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);
            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                Email email = EmailFactory.Registration(user);
                _smtpService.SendMail(email);
            }

            return result;
        }

        public async Task<LoggedUserResponse?> ValidateUser(Login request)
        {
            User? user;

            if (request.UserOrEmail.Contains('@'))
            { user = await _userManager.FindByEmailAsync(request.UserOrEmail); }
            else
            { user = await _userManager.FindByNameAsync(request.UserOrEmail); }

            if (user == null) return null;

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!isPasswordValid) return new LoggedUserResponse { };

            if (!await _userManager.IsEmailConfirmedAsync(user)) return new LoggedUserResponse { Preferences = user.Preferences};
            
            var result = _tokenService.CreateToken(isPasswordValid, user);
            return new LoggedUserResponse
            {
                Token = result,
                Preferences = user.Preferences
            };
        }

        public async Task<string> ConfirmEmail(string id, string token)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return "Email";

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return "Token";

            token = _tokenService.CreateToken(true, user);
            return token;
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

            Email emailDto = EmailFactory.Confirmation(user, result);
            _smtpService.SendMail(emailDto);

            return result + "\n" + user.Name;
        }

        public async Task<string> SendPasswordResetEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return "";
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            Email emailDto = EmailFactory.PasswordReset(user, token);
            _smtpService.SendMail(emailDto);

            return token;
        }
        public async Task<IdentityResult> ResetPassword(PasswordResetDto request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null) return IdentityResult.Failed();
            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            return result;
        }

        public async Task<LoggedUserResponse?> ExternalLogin(ProviderInfoDto request, string provider)
        {
            if (request == null) return null;

            var url = "";
            switch (provider)
            {
                case "Google":
                    url = $"{_googleUserInfoUrl}?access_token={request.Token}";
                    break;

                case "Facebook":
                    url = $"{_facebookUserInfoUrl}?input_token={request.Token}";
                    break;
            }
            var check = await CheckRequest(request, url);

            if (!check) return null;

            var email = request.Email;
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = email,
                    Email = email,
                    Name = request.Name,
                    EmailConfirmed = true
                };

                switch(provider)
                {
                    case "Google":
                        user.GoogleId = request.Id;
                        break;

                    case "Facebook":
                        user.FacebookId = request.Id;
                        break;
                }

                var r = await _userManager.CreateAsync(user);

                if (r.Succeeded)
                {
                    Email e = EmailFactory.Registration(user);
                    _smtpService.SendMail(e);
                }
                else return null;
            }

            else
            {
                switch (provider)
                {
                    case "Google":
                        user.GoogleId = request.Id;
                        break;

                    case "Facebook":
                        user.FacebookId = request.Id;
                        break;
                }

                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);
            }

            var token = _tokenService.CreateToken(true, user);


            return new LoggedUserResponse
            {
                Token = token,
                Preferences = user.Preferences
            };
        }

        

        private static async Task<bool> CheckRequest(ProviderInfoDto request, string url) {
            using var httpClient = new HttpClient();

            var response = await httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var userProfile = JsonConvert.DeserializeObject<ProviderLoginProfile>(content);

            if (userProfile == null) return false;

            if (userProfile.Email != request.Email || userProfile.Name != request.Name) return false;

            return true;
        }
    }
}
