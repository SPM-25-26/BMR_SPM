using Azure.Core;
using Eppoi.Server.Models;
using Eppoi.Server.Models.Dto;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Identity;

namespace eppoi.Server.Services
{
    public class AuthenticationService(UserManager<User> userService, TokenService tokenService)
    {
        private readonly UserManager<User> _userManager = userService;
        private readonly TokenService _tokenService = tokenService;

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

            return result;
        }

        public async Task<string> ValidateUser(Login request)
        {
            User? user;

            if (request.UserOrEmail.Contains('@')) 
                { user = await _userManager.FindByEmailAsync(request.UserOrEmail); }
            else
                { user = await _userManager.FindByNameAsync(request.UserOrEmail); }

            //TODO: New method to confirm email
            if (user != null && !user.EmailConfirmed) user.EmailConfirmed = true;

            if (user == null) return "";

            var isPasswordValid = user != null && await _userManager.CheckPasswordAsync(user, request.Password);

            var result = _tokenService.CreateToken(isPasswordValid, user);
            return result;
        }

    }
}
