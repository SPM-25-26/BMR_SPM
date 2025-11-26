using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Eppoi.Server.Models;
using Eppoi.Server.Models.Dto;
using Eppoi.Server.Services;
using eppoi.Server.Services;
using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Responses;
using System.Net.WebSockets;

namespace Eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EppoiController(AuthenticationService _authenticationService, ILogger<EppoiController> _logger) : ControllerBase
    {
        
        [HttpPost("Register")]
        public async Task<ActionResult> Register(UserDto user)
        {
            var result = await _authenticationService.CreateUser(user);

            if (!result.Succeeded)
            {
                _logger.LogError("User Creation Failed. \n {result}", result);
                return BadRequest(ResponseFactory.WithError(result));
            }
            
            _logger.LogInformation("User Created");
            return Ok(ResponseFactory.WithSuccess( new CreateUserResponse() { Name = user.Name, UserName = user.UserName,
                Email = user.Email, Message = "User Created Succesfully." }));
        }


        [HttpPost("Login")]
        public async Task<ActionResult> Login(Login login)
        {
            var result = await _authenticationService.ValidateUser(login);

            if (string.IsNullOrEmpty(result)) return BadRequest(ResponseFactory.WithError(result));
            
            return Ok(ResponseFactory.WithSuccess(result));
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
