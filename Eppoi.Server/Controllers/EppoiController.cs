using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Eppoi.Server.Models;
using Eppoi.Server.Models.Dto;
using Eppoi.Server.Services;
using eppoi.Server.Services;
using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Responses;
using System.Net.WebSockets;
using eppoi.Server.Models.Dto;

namespace Eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EppoiController(AuthenticationService _authenticationService, ILogger<EppoiController> _logger) : ControllerBase
    {
        
        [HttpPost("Sign Up")]
        public async Task<ActionResult> SignUp(UserDto user)
        {
            var result = await _authenticationService.CreateUser(user);

            if (!result.Succeeded)
            {
                _logger.LogError("User Creation Failed: {result}", result);
                return BadRequest(ResponseFactory.WithError("User Creation Failed: " + result));
            }
            
            var code = await _authenticationService.SendVerificationEmail(user.Email);

            _logger.LogInformation("User Created");
            return Ok(ResponseFactory.WithSuccess( new CreateUserResponse() { Name = user.Name, UserName = user.UserName,
                Email = user.Email, Message = "User Created Succesfully. Please Confirm your Email: " + code }));
        }

        
        [HttpPost("Login")]
        public async Task<ActionResult> Login(Login login)
        {
            var result = await _authenticationService.ValidateUser(login);

            if (string.IsNullOrEmpty(result)) return BadRequest(ResponseFactory.WithError("Login Failed."));
            
            if (result.Equals("Confirm")) { 
                var code = await _authenticationService.SendVerificationEmail(login.UserOrEmail);
                return BadRequest(ResponseFactory.WithSuccess("Please Confirm your Email: " + code)); }

            return Ok(ResponseFactory.WithSuccess("User Logged in Successfully: " + result));
        }

        
        [HttpPost("Confirm Email")]
        public async Task<ActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var result = await _authenticationService.ConfirmEmail(confirmEmailDto.Email, confirmEmailDto.Token);
            if (!result.Succeeded) return BadRequest(ResponseFactory.WithError("Email Confirmation Failed: " + result));
            return Ok(ResponseFactory.WithSuccess("Email Confirmed Successfully."));
        }

        
        [HttpPost("Recover Password")]
        public async Task<ActionResult> RecoverPassword(string email)
        {
            var result = await _authenticationService.SendPasswordResetEmail(email);
            if (string.IsNullOrEmpty(result)) return BadRequest(ResponseFactory.WithError("User Not Found."));
            return Ok(ResponseFactory.WithSuccess("Password Reset Token Sent: " + result));
        }

        
        [HttpPost("Reset Password")]
        public async Task<ActionResult> ResetPassword(PasswordResetDto resetPasswordDto)
        {
            var result = await _authenticationService.ResetPassword(resetPasswordDto);
            if (!result.Succeeded) return BadRequest(ResponseFactory.WithError("Password Reset Failed: " + result));
            return Ok(ResponseFactory.WithSuccess("Password Reset Successfully."));
        }




        //[HttpGet("home/{email}"), Authorize]
        //public async Task<ActionResult<string>> HomePage(string email)
        //{
        // try
        // {
        //     User userInfo = await _userManager.FindByEmailAsync(email);
        //     if (userInfo == null) return BadRequest("Something went wrong. Try again.");
        //     return Ok(new { userInfo = userInfo});
        // }

        // catch (Exception ex)
        // {
        //   return BadRequest(ex.Message);
        // }
        // }

    }
}
