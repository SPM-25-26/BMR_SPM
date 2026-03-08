using eppoi.Server.Models.Information.Dtos;

namespace eppoi.Server.Services.Interfaces
{
    public interface IInformationService
    {
        Task<ArticleDto?> GetArticleDetails(string id);
        Task<IEnumerable<BaseInfoDto>> GetBaseInfo(int skip, int take);
        Task<IEnumerable<CategoryDto>> GetCategories();
        Task<EntertainmentDto?> GetEntertainmentDetails(string id);
        Task<EventDto?> GetEventDetails(string id);
        Task<OrganizationDto?> GetOrganizationDetails(string id);
        Task<PoiDto?> GetPoiDetails(string id);
        Task<RestaurantDto?> GetRestaurantDetails(string id);
        Task<RouteDto?> GetRouteDetails(string id);
        Task<ShoppingDto?> GetShoppingDetails(string id);
        Task<SleepDto?> GetSleepDetails(string id);
    }
}