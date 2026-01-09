using eppoi.Server.Models.Authentication;
using eppoi.Server.Models.Authentication.Dto;
using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Responses;
using Microsoft.AspNetCore.Mvc;

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

            //Thread.Sleep(10 * 1000);
            var code = await _authenticationService.SendVerificationEmail(user.Email);

            _logger.LogInformation("User Created");
            return Ok(ResponseFactory.WithSuccess(new CreateUserResponse()
            {
                Name = user.Name,
                UserName = user.UserName,
                Email = user.Email,
                Preferences = user.Preferences.ToString(),
                Message = code
            }));
        }

        [HttpPost("GoogleLogin")]
        public async Task<ActionResult> GoogleLogin(ProviderInfoDto login)
        {
            var result = await _authenticationService.ExternalLogin(login, "Google");
            if (result.Contains("Error")) return BadRequest(ResponseFactory.WithError("Google Login Failed. " + result));
            return Ok(ResponseFactory.WithSuccess(result));
        }

        [HttpPost("FacebookLogin")]
        public async Task<ActionResult> FacebookLogin(ProviderInfoDto login)
        {
            var result = await _authenticationService.ExternalLogin(login, "Facebook");
            if (result.Contains("Error")) return BadRequest(ResponseFactory.WithError("Facebook Login Failed. ") + result);
            return Ok(ResponseFactory.WithSuccess(result));
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(Login login)
        {
            var result = await _authenticationService.ValidateUser(login);

            if (string.IsNullOrEmpty(result)) return BadRequest(ResponseFactory.WithError("Login Failed."));

            if (result.Equals("ErrPw")) return BadRequest(ResponseFactory.WithError("Incorrect Password."));
            if (result.Equals("Confirm"))
            {
                var code = await _authenticationService.SendVerificationEmail(login.UserOrEmail);
                return BadRequest(ResponseFactory.WithError(code));
            }

            return Ok(ResponseFactory.WithSuccess(result));
        }


        [HttpPost("ConfirmEmail")]
        public async Task<ActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var result = await _authenticationService.ConfirmEmail(confirmEmailDto.Id, confirmEmailDto.Token);

            if (result.Equals("Email")) return BadRequest(ResponseFactory.WithError("Email Not Found."));
            if (result.Equals("Token")) return BadRequest(ResponseFactory.WithError("Invalid Token."));

            return Ok(ResponseFactory.WithSuccess(result));
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
