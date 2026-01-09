using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Options.Dto;
using eppoi.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class OptionsController(ILogger<OptionsController> _logger, OptionsService _optionsService) : ControllerBase
    {
        [HttpPut("ChangePreferences")]
        public async Task<ActionResult> ChangePreferences(PreferencesDto changes)
        {
            var r = await _optionsService.ChangePreferences(changes);

            return (r) switch
            {
                -1 => BadRequest(ResponseFactory.WithError("User Not Found.")),
                0 => BadRequest(ResponseFactory.WithError("Update Failed.")),
                _ => Ok(ResponseFactory.WithSuccess("Update Completed."))
            };
        }
    }
}
