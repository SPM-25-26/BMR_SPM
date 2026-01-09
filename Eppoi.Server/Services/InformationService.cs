using eppoi.Models.Data;
using eppoi.Server.Models.Information.Dtos;
using Microsoft.EntityFrameworkCore;

namespace eppoi.Server.Services
{
    public class InformationService(ApplicationDBContext _context)
    {
        public async Task<IEnumerable<CategoryDto>> GetCategories()
        {
            return await _context.Categories.Select(category => new CategoryDto
            {
                Name = category.Name,
                ImagePath = category.ImagePath,
                Label = category.Label
            }).ToListAsync();
        }

        public async Task<IEnumerable<BaseInfoDto>> GetBaseInfo(int skip = 10, int take = 10)
        {
            var result = _context.ArtNatures.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Category = x.Category
            });

            result = result.Concat(_context.Events.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Description,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Date = x.GetDateString(),
                Category = "Event"
            }));

            result = result.Concat(_context.Articles.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.TimeToRead,
                Category = "Article"
            }));

            result = result.Concat(_context.Entertainments.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Category,
                Address = x.Address,
                Category = "Entertainment"
            }));

            result = result.Concat(_context.Organizations.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Category = "Organization"
            }));

            result = result.Concat(_context.Restaurants.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Category = "Restaurant"
            }));

            result = result.Concat(_context.Routes.Select(x => new BaseInfoDto
            {
                Id = x.Id!,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Duration,
                Category = "Route"
            }));

            result = result.Concat(_context.Shoppings.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Website,
                Address = x.Address,
                Category = "Shopping"
            }));

            result = result.Concat(_context.Sleeps.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Category = "Sleep"
            }));

            return await result
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<PoiDto?> GetPoiDetails(string id)
        {
            var item = await _context.ArtNatures.FindAsync(id);

            if (item is null)
                return null;

            return new PoiDto
            {
                Id = item.Id,
                Name = item.Name,
                ImagePath = item.ImagePath,
                Type = item.Type,
                Description = item.Description,
                Category = item.Category,
                Address = item.Address,
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                Gallery = item.Gallery ?? [],
                Catalogues = item.Catalogues,
                CreativeWorks = item.CreativeWorks,
                Site = item.Site
            };
        }

        public async Task<EventDto?> GetEventDetails(string id)
        {
            var item = await _context.Events.FindAsync(id);

            if (item is null)
                return null;

            return new EventDto
            {
                Id = item.Id,
                Name = item.Name,
                Address = item.Address,
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                Description = item.Description,
                BadgeText = item.Type,
                ImagePath = item.ImagePath,
                Category = "Event",
                Audience = item.Audience,
                Date = item.GetDateString(),
                Organizer = item.Organizer
            };
        }

        public async Task<ArticleDto?> GetArticleDetails(string id)
        {
            var item = await _context.Articles.FindAsync(id);

            if (item is null)
                return null;

            return new ArticleDto
            {
                Id = item.Id,
                Name = item.Name,
                Script = item.Script,
                SubTitle = item.Subtitle,
                ImagePath = item.ImagePath,
                TimeToRead = item.TimeToRead,
                LastUpdate = item.UpdatedAt.ToString(),
                Themes = item.Themes,
                Paragraphs = item.Paragraphs,
                Category = "Article"
            };
        }

        public async Task<OrganizationDto?> GetOrganizationDetails(string id)
        {
            var item = await _context.Organizations.FindAsync(id);

            if (item is null)
                return null;

            return new OrganizationDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                ImagePath = item.ImagePath,
                Type = item.Type,
                Address = item.Address,
                LegalStatus = item.LegalStatus,
                Gallery = item.Gallery,
                Telephone = item.Telephone,
                Email = item.Email,
                Facebook = item.Facebook,
                Instagram = item.Instagram,
                Website = item.Website,
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                OwnedPois = item.OwnedPois,
                Category = "Organization"
            };
        }

        public async Task<RestaurantDto?> GetRestaurantDetails(string id)
        {
            var item = await _context.Restaurants.FindAsync(id);

            if (item is null)
                return null;

            return new RestaurantDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                ImagePath = item.ImagePath,
                Type = item.Type,
                Address = item.Address,
                Email = item.Email ?? string.Empty,
                Website = item.Website ?? string.Empty,
                Instagram = item.Instagram ?? string.Empty,
                Facebook = item.Facebook ?? string.Empty,
                Telephone = item.Telephone ?? string.Empty,
                Gallery = item.Gallery,
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                OpeningHours = item.OpeningHours,
                DietaryNeeds = item.DietaryNeeds ?? [],
                Owner = item.Owner,
                Category = "Restaurant"
            };
        }

        public async Task<SleepDto?> GetSleepDetails(string id)
        {
            var item = await _context.Sleeps.FindAsync(id);

            if (item is null)
                return null;

            return new SleepDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                ImagePath = item.ImagePath,
                Type = item.Type,
                Address = item.Address,
                Email = item.Email ?? string.Empty,
                Website = item.Website ?? string.Empty,
                Telephone = item.Telephone ?? string.Empty,
                Instagram = item.Instagram ?? string.Empty,
                Facebook = item.Facebook ?? string.Empty,
                Gallery = item.Gallery,
                Classification = item.Classification,
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                Services = item.Services,
                Owner = item.Owner,
                Category = "Sleep"
            };
        }

        public async Task<ShoppingDto?> GetShoppingDetails(string id)
        {
            var item = await _context.Shoppings.FindAsync(id);

            if (item is null)
                return null;

            return new ShoppingDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                ImagePath = item.ImagePath,
                Gallery = item.Gallery ?? [],
                Website = item.Website,
                Telephone = item.Telephone,
                Instagram = item.Instagram,
                Facebook = item.Facebook,
                Address = item.Address,
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                Email = item.Email,
                Owner = item.Owner,
                Category = "Shopping"
            };
        }

        public async Task<RouteDto?> GetRouteDetails(string id)
        {
            var item = await _context.Routes.FindAsync(id);

            if (item is null)
                return null;

            return new RouteDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                Duration = item.Duration,
                ImagePath = item.ImagePath,
                Type = item.Type,
                TravellingMethod = item.TravellingMethod,
                ShortName = item.ShortName,
                Website = item.Website,
                Telephone = item.Telephone,
                Facebook = item.Facebook,
                Email = item.Email,
                SecurityLevel = item.SecurityLevel,
                NumberOfStages = item.NumberOfStages,
                QuantifiedPathwayPaving = item.QuantifiedPathwayPaving,
                RouteLength = item.RouteLength,
                Stages = item.Stages,
                StartingPoint = item.StartingPoint,
                Category = "Route"
            };
        }

        public async Task<EntertainmentDto?> GetEntertainmentDetails(string id)
        {
            var item = await _context.Entertainments.FindAsync(id);

            if (item is null)
                return null;

            return new EntertainmentDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                ImagePath = item.ImagePath,
                Address = item.Address ?? string.Empty,
                Gallery = item.Gallery ?? [],
                Latitude = item.Latitude,
                Longitude = item.Longitude,
                Category = "Entertainment"
            };
        }
    }
}
