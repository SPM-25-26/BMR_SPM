using eppoi.Models.Entities.Import;
using eppoi.Models.Entities.Import.Articles;
using eppoi.Models.Entities.Import.ArtNatures;
using eppoi.Models.Entities.Import.Events;
using eppoi.Models.Entities.Import.Organizations;
using eppoi.Server.Models.Dtos;
using eppoi.Server.Services.Infrastructure;
using Eppoi.Server.Controllers;
using Eppoi.Server.Models.LocalInfo.Enums;
using eppoi.Server.Exceptions;

namespace eppoi.Server.Services
{
    public class LocalInfoService(ILogger<LocalInfoController> _logger, IUnitOfWork unitOfWork) : ILocalInfoService
    {
        public async Task<IEnumerable<CategoryDto>> GetCategories()
        {
            IEnumerable<Category> categories = await unitOfWork.Categories.GetAllAsync();
            return categories.Select(category => new CategoryDto
            {
                Name = category.Name,
                Label = category.Label                
            });
        }
        public async Task<IEnumerable<DiscoverItemDto>> GetDiscoverListByType(DiscoverType type)
        {
            IEnumerable<DiscoverItemDto> result;
            switch (type)
            {
                case DiscoverType.Poi:
                    IEnumerable<ArtNature> poisList = await unitOfWork.PointOfInterests.GetAllAsync();                    

                    result = poisList.Select(poi => new DiscoverItemDto
                    {
                        EntityId = poi.Id,
                        EntityName = poi.Name,
                        ImagePath = poi.ImagePath,
                        BadgeText = poi.Type,
                        Address = poi.Address
                    });
                    break;

                case DiscoverType.Event:
                    IEnumerable<Event> eventsList = await unitOfWork.Events.GetAllAsync();
                    
                    result = eventsList.Select(evt =>
                    {
                        // Date can be a range or single
                        var date = evt.Date == null ? "" : evt.Date;
                        if (string.IsNullOrEmpty(date))
                        {
                            var startDate = evt.StartDate;
                            var endDate = evt.StartDate;

                            date = string.IsNullOrEmpty(startDate) ? "" : startDate;
                            date += string.IsNullOrEmpty(startDate) || string.IsNullOrEmpty(endDate) ? "" : " - ";
                            date += string.IsNullOrEmpty(endDate) ? "" : endDate;
                        }
                        
                        return new DiscoverItemDto
                        {
                            EntityId = evt.Id,
                            EntityName = evt.Description,
                            ImagePath = evt.Image,
                            BadgeText = evt.Typology,
                            Address = "",
                            Date = date
                        };
                    });
                    break;

                case DiscoverType.Article:
                    IEnumerable<Article> articlesList = await unitOfWork.Articles.GetAllAsync();

                    result = articlesList.Select(article => new DiscoverItemDto
                    {
                        EntityId = article.Id,
                        EntityName = article.Title,
                        ImagePath = article.ImagePath,
                        BadgeText = article.TimeToRead
                    });
                    break;

                case DiscoverType.Organization:
                    IEnumerable<Organization> organizationsList = await unitOfWork.Organizations.GetAllAsync();
      
                    result = organizationsList.Select(organization => new DiscoverItemDto
                    {
                        EntityId = organization.Id,
                        EntityName = organization.Name,
                        ImagePath = organization.ImagePath,
                        BadgeText = organization.Type
                    });
                    break;

                default:
                    result = new List<DiscoverItemDto>();
                    break;
            }

            return result;
        }

        public async Task<PointOfInterestDto> GetPoiByIdAsync(string id)
        {
            ArtNature point = await unitOfWork.PointOfInterests.GetAsync(id);
            
            if (point is null)
            {
                _logger.LogWarning("Point of Interest with ID {id} not found.", id);
                throw new NotFoundException($"Point of Interest with ID {id} not found.");
            }

            return new PointOfInterestDto()
            {
                EntityId = point.Id,
                EntityName = point.Name,
                ImagePath = point.ImagePath,
                BadgeText = point.Type,
                Description = point.Description,
                Category = point.Category,
                Address = point.Address,
                Latitude = point.Latitude,
                Longitude = point.Longitude,
                Gallery = point.Gallery ?? Array.Empty<string>()
            };
        }
    }
}