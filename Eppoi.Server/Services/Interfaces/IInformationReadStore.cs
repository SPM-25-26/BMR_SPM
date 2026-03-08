using eppoi.Models.Entities.Import;
using eppoi.Models.Entities.Import.ArtNatures;
using eppoi.Models.Entities.Import.Articles;
using eppoi.Models.Entities.Import.Events;
using eppoi.Models.Entities.Import.Organizations;
using eppoi.Models.Entities.Import.Restaurants;

namespace eppoi.Server.Services.Interfaces
{
    public interface IInformationReadStore
    {
        Task<List<Category>> GetCategoriesAsync();
        Task<ArtNature?> FindArtNatureByIdAsync(string id);

        Task<List<ArtNature>> GetArtNaturesAsync();
        Task<List<Event>> GetEventsAsync();
        Task<List<Article>> GetArticlesAsync();
        Task<List<Entertainment>> GetEntertainmentsAsync();
        Task<List<Organization>> GetOrganizationsAsync();
        Task<List<Restaurant>> GetRestaurantsAsync();
        Task<List<eppoi.Models.Entities.Import.Routes.Route>> GetRoutesAsync();
        Task<List<Shopping>> GetShoppingsAsync();
        Task<List<Sleep>> GetSleepsAsync();
    }
}