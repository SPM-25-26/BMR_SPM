using eppoi.Models.Data;
using eppoi.Server.Models.Information.Dtos;
using eppoi.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace eppoi.Server.Services
{
    public class InformationService : IInformationService
    {
        private readonly ApplicationDBContext? _context;
        private readonly IInformationReadStore? _readStore;

        public InformationService(ApplicationDBContext context)
        {
            _context = context;
        }

        public InformationService(IInformationReadStore readStore)
        {
            _readStore = readStore;
        }

        private ApplicationDBContext GetContext()
        {
            return _context ?? throw new InvalidOperationException(
                "ApplicationDBContext non disponibile. Usa il costruttore con ApplicationDBContext per i metodi che richiedono EF.");
        }

        public async Task<IEnumerable<CategoryDto>> GetCategories()
        {
            if (_readStore is not null)
            {
                var categories = await _readStore.GetCategoriesAsync();
                return categories.Select(category => new CategoryDto
                {
                    Name = category.Name,
                    ImagePath = category.ImagePath,
                    Label = category.Label
                });
            }

            var context = GetContext();
            return await context.Categories.Select(category => new CategoryDto
            {
                Name = category.Name,
                ImagePath = category.ImagePath,
                Label = category.Label
            }).ToListAsync();
        }

        public async Task<IEnumerable<BaseInfoDto>> GetBaseInfo(int skip, int take)
        {
            if (skip < 0 || take <= 0)
                return [];

            if (_readStore is not null)
            {
                List<BaseInfoDto> result = [];

                result.AddRange((await _readStore.GetArtNaturesAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Type,
                    Address = x.Address,
                    Category = x.Category,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude
                }));

                result.AddRange((await _readStore.GetEventsAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Description,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Type,
                    Address = x.Address,
                    Date = x.GetDateString(),
                    Category = "Event",
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    Audience = x.Audience
                }));

                result.AddRange((await _readStore.GetArticlesAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.TimeToRead,
                    Category = "Article"
                }));

                result.AddRange((await _readStore.GetEntertainmentsAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Category,
                    Address = x.Address,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    Category = "Entertainment"
                }));

                result.AddRange((await _readStore.GetOrganizationsAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Type,
                    Address = x.Address,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    Category = "Organization"
                }));

                result.AddRange((await _readStore.GetRestaurantsAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Type,
                    Address = x.Address,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    DietaryNeeds = x.DietaryNeeds,
                    Category = "Restaurant"
                }));

                result.AddRange((await _readStore.GetRoutesAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id!,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Duration,
                    Latitude = x.StartingPoint.Latitude,
                    Longitude = x.StartingPoint.Longitude,
                    Category = "Route"
                }));

                result.AddRange((await _readStore.GetShoppingsAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Website,
                    Address = x.Address,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    Category = "Shopping"
                }));

                result.AddRange((await _readStore.GetSleepsAsync()).Select(x => new BaseInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ImagePath = x.ImagePath,
                    BadgeText = x.Type,
                    Address = x.Address,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    Category = "Sleep"
                }));

                return result.Skip(skip).Take(take);
            }

            var context = GetContext();

            var dbResult = await context.ArtNatures.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Category = x.Category,
                Latitude = x.Latitude,
                Longitude = x.Longitude
            }).ToListAsync();

            dbResult.AddRange(await context.Events.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Description,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Date = x.GetDateString(),
                Category = "Event",
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Audience = x.Audience
            }).ToListAsync());

            dbResult.AddRange(await context.Articles.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.TimeToRead,
                Category = "Article"
            }).ToListAsync());

            dbResult.AddRange(await context.Entertainments.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Category,
                Address = x.Address,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Category = "Entertainment"
            }).ToListAsync());

            dbResult.AddRange(await context.Organizations.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Category = "Organization"
            }).ToListAsync());

            dbResult.AddRange(await context.Restaurants.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                DietaryNeeds = x.DietaryNeeds,
                Category = "Restaurant"
            }).ToListAsync());

            dbResult.AddRange(await context.Routes.Select(x => new BaseInfoDto
            {
                Id = x.Id!,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Duration,
                Latitude = x.StartingPoint.Latitude,
                Longitude = x.StartingPoint.Longitude,
                Category = "Route"
            }).ToListAsync());

            dbResult.AddRange(await context.Shoppings.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Website,
                Address = x.Address,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Category = "Shopping"
            }).ToListAsync());

            dbResult.AddRange(await context.Sleeps.Select(x => new BaseInfoDto
            {
                Id = x.Id,
                Name = x.Name,
                ImagePath = x.ImagePath,
                BadgeText = x.Type,
                Address = x.Address,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Category = "Sleep"
            }).ToListAsync());

            return dbResult.Skip(skip).Take(take);
        }

        public async Task<PoiDto?> GetPoiDetails(string id)
        {
            var item = _readStore is not null
                ? await _readStore.FindArtNatureByIdAsync(id)
                : await GetContext().ArtNatures.FindAsync(id);

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
            var item = await GetContext().Events.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Articles.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Organizations.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Restaurants.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Sleeps.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Shoppings.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Routes.FindAsync(id);
            if (item is null) return null;

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
            var item = await GetContext().Entertainments.FindAsync(id);
            if (item is null) return null;

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
