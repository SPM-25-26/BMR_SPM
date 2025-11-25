using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Test : ControllerBase
    {

        [HttpGet("api/ping")]
        [Authorize]
        public ActionResult<string> Ping()
        {
            return Ok("Hello, World!");
        }
    }
}
