using eppoi.Server.Models.Factories;
using eppoi.Server.Services;
using Eppoi.Server.Models.LocalInfo.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalInfoController(ILogger<LocalInfoController> _logger, ILocalInfoService localInfoService) : ControllerBase
    {
        private readonly ILocalInfoService _localInfoService = localInfoService;

        [HttpGet("GetCategories")]
        [Authorize]
        public ActionResult GetCategories()
        {
            var discoverList = _localInfoService.GetCategories();
            _logger.LogInformation("List of categories generated");
            return Ok(ResponseFactory.WithSuccess(discoverList));
        }

        [HttpGet("GetDiscoverList")]
        [Authorize]
        public ActionResult GetDiscoverList([FromQuery] DiscoverType type)        
        {            
            var discoverList = _localInfoService.GetDiscoverListByType(type);
            _logger.LogInformation("Discover list of type {DiscoverType} generated", type);
            return Ok(ResponseFactory.WithSuccess(discoverList));
        }
    }
}