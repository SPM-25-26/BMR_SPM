using eppoi.Models.Entities;
using eppoi.Server.Models.Factories;
using eppoi.Server.Services;
using eppoi.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class OptionsController(ILogger<OptionsController> _logger, IOptionsService _optionsService) : ControllerBase
    {
        [HttpPut("ChangePreferences")]
        public async Task<ActionResult> ChangePreferences(IEnumerable<Preferences> changes)
        {
            var user = User.Claims.FirstOrDefault(x => x.Type == "UserName")!.Value;
            var r = await _optionsService.ChangePreferences(changes, user);

            if (!r.Succeeded)
            {
                _logger.LogInformation("User Not Found.");
                return BadRequest(ResponseFactory.WithError("User Not Found."));
            }
            _logger.LogInformation("Preference Update Completed.");
            return Ok(ResponseFactory.WithSuccess("Update Completed."));
        }
    }
}
