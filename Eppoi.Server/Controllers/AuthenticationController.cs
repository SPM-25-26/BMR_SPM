using eppoi.Server.Models.Dto;
using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Responses;
using eppoi.Server.Services;
using Eppoi.Server.Models;
using Eppoi.Server.Models.Dto;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Net.WebSockets;

namespace Eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController(eppoi.Server.Services.AuthenticationService _authenticationService, ILogger<AuthenticationController> _logger) : ControllerBase
    {

        [HttpPost("SignUp")]
        public async Task<ActionResult> SignUp(UserDto user)
        {
            var result = await _authenticationService.CreateUser(user);

            if (!result.Succeeded)
            {
                _logger.LogError("User Creation Failed: {result}", result);
                return BadRequest(ResponseFactory.WithError(result));
            }

            var code = await _authenticationService.SendVerificationEmail(user.Email);

            _logger.LogInformation("User Created");
            return Ok(ResponseFactory.WithSuccess(new CreateUserResponse()
            {
                Name = user.Name,
                UserName = user.UserName,
                Email = user.Email,
                Message = code
            }));
        }


        [HttpPost("Login")]
        public async Task<ActionResult> Login(Login login)
        {
            var result = await _authenticationService.ValidateUser(login);

            if (string.IsNullOrEmpty(result)) return BadRequest(ResponseFactory.WithError("Login Failed."));

            if (result.Equals("Confirm"))
            {
                var code = await _authenticationService.SendVerificationEmail(login.UserOrEmail);
                return BadRequest(ResponseFactory.WithSuccess(code));
            }

            return Ok(ResponseFactory.WithSuccess(result));
        }


        [HttpPost("ConfirmEmail")]
        public async Task<ActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var result = await _authenticationService.ConfirmEmail(confirmEmailDto.Email, confirmEmailDto.Token);
            if (!result.Succeeded) return BadRequest(ResponseFactory.WithError(result));
            return Ok(ResponseFactory.WithSuccess("Email Confirmed Successfully."));
        }


        [HttpPost("RecoverPassword")]
        public async Task<ActionResult> RecoverPassword(string email)
        {
            var result = await _authenticationService.SendPasswordResetEmail(email);
            if (string.IsNullOrEmpty(result)) return BadRequest(ResponseFactory.WithError("User Not Found."));
            return Ok(ResponseFactory.WithSuccess(result));
        }


        [HttpPost("ResetPassword")]
        public async Task<ActionResult> ResetPassword(PasswordResetDto resetPasswordDto)
        {
            var result = await _authenticationService.ResetPassword(resetPasswordDto);
            if (!result.Succeeded) return BadRequest(ResponseFactory.WithError(result));
            return Ok(ResponseFactory.WithSuccess("Password Reset Successfully."));
        }

    }
}
