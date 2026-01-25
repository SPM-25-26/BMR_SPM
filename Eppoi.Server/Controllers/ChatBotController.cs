using eppoi.Models;
using eppoi.Server.Models.Factories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ChatBotController(GeminiService _geminiService) : ControllerBase
    {
        [HttpPost("AskChatBot")]
        public async Task<ActionResult> AskChatBot(ContentsGeminiDto contents)
        {
            return Ok(ResponseFactory.WithSuccess(await _geminiService.Ask(contents)));
        }
    }
}
