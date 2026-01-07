using eppoi.Server.Models.Factories;
using eppoi.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eppoi.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class InformationController(ILogger<InformationController> _logger, InformationService _informationService) : ControllerBase
    {

        [HttpGet("GetCategories")]
        public ActionResult GetCategories()
        {
            var discoverList = _informationService.GetCategories();
            _logger.LogInformation("Categories Generated.");
            return Ok(ResponseFactory.WithSuccess(discoverList));
        }

        [HttpGet("GetBaseInformation")]
        public ActionResult GetBaseInfo()
        {
            var discoverList = _informationService.GetBaseInfo();
            _logger.LogInformation("Base Information of All Categories Generated.");
            return Ok(ResponseFactory.WithSuccess(discoverList));
        }

        [HttpGet("GetDetails")]
        public ActionResult GetPOIById([FromQuery] string id, [FromQuery] int category)
        {
            return category switch
            {
                0 => Result(_informationService.GetPoiDetails(id)),
                1 => Result(_informationService.GetEventDetails(id)),
                2 => Result(_informationService.GetArticleDetails(id)),
                3 => Result(_informationService.GetOrganizationDetails(id)),
                4 => Result(_informationService.GetRestaurantDetails(id)),
                5 => Result(_informationService.GetSleepDetails(id)),
                6 => Result(_informationService.GetShoppingDetails(id)),
                7 => Result(_informationService.GetRouteDetails(id)),
                8 => Result(_informationService.GetEntertainmentDetails(id)),
                _ => BadRequest(ResponseFactory.WithError("Category Not Found.")),
            };
        }

        private ActionResult Result<T>(Task<T> item)
        {
            if (item == null)
            {
                _logger.LogInformation("Item Not Found.");
                return BadRequest(ResponseFactory.WithError("Id Not Found."));
            }

            _logger.LogInformation("Item Found");
            return Ok(ResponseFactory.WithSuccess(item));
        }
    }
}
