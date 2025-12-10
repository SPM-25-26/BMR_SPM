using eppoi.Models.Entities;
using eppoi.Server.Models.Authentication;
using eppoi.Server.Models.Authentication.Dto;
using eppoi.Server.Models.Factories;
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
        private readonly string _googleMapsInfoUrl = "https://roads.googleapis.com/v1/snapToRoads"; // ?lat,long&key=googlekey

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

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!isPasswordValid) return "ErrPw";

            if (!await _userManager.IsEmailConfirmedAsync(user)) return "Confirm";
            
            var result = _tokenService.CreateToken(isPasswordValid, user);
            return result;
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

        public async Task<string> GoogleLogin(GoogleInfoDto request)
        {
            if (request == null) return "Request Error";
            var check = await CheckRequest(request);

            if (!check) return "Validation Error";

            var email = request.Email;
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new User
                {
                    UserName = email.Split('@')[0],
                    GoogleId = request.Id,
                    Email = email,
                    Name = request.Name,
                    CreatedDate = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                await _userManager.CreateAsync(user);
            }

            else
            {
                if (user.GoogleId == null)
                {
                    user.GoogleId = request.Id;
                    user.EmailConfirmed = true;
                    await _userManager.UpdateAsync(user);
                }
            }

            var result = _tokenService.CreateToken(true, user);
            return result;
        }





        private async Task<bool> CheckRequest(GoogleInfoDto request) {
            using var httpClient = new HttpClient();

            var response = await httpClient.GetAsync($"{_googleUserInfoUrl}?access_token={request.GoogleToken}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var userProfile = JsonConvert.DeserializeObject<GoogleUserProfile>(content);

            if (userProfile == null) return false;

            if (userProfile.Email != request.Email || userProfile.Name != request.Name) return false;

            return true;
        }
    }
}
