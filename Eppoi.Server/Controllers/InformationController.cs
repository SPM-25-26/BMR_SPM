using eppoi.Server.Models.Factories;
using eppoi.Server.Models.Information.Enums;
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
        public ActionResult GetBaseInfo(int skip, int take)
        {
            var id = User.Claims.FirstOrDefault(x => x.Type == "id").Value;
            var discoverList = _informationService.GetBaseInfo(skip, take);
            _logger.LogInformation("Base Information of All Categories Generated.");
            return Ok(ResponseFactory.WithSuccess(discoverList));
        }

        [HttpGet("GetDetails")]
        public ActionResult GetDetails([FromQuery] string id, [FromQuery] CategoryEnum category)
        {
            return category switch
            {
                CategoryEnum.Poi => Result(_informationService.GetPoiDetails(id)),
                CategoryEnum.Event => Result(_informationService.GetEventDetails(id)),
                CategoryEnum.Article => Result(_informationService.GetArticleDetails(id)),
                CategoryEnum.Organization => Result(_informationService.GetOrganizationDetails(id)),
                CategoryEnum.Restaurant => Result(_informationService.GetRestaurantDetails(id)),
                CategoryEnum.Sleep => Result(_informationService.GetSleepDetails(id)),
                CategoryEnum.Shopping => Result(_informationService.GetShoppingDetails(id)),
                CategoryEnum.Route => Result(_informationService.GetRouteDetails(id)),
                CategoryEnum.Entertainment => Result(_informationService.GetEntertainmentDetails(id)),
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
