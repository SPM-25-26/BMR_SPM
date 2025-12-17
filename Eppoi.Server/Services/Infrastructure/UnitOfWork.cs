using eppoi.Models.Data;
using eppoi.Server.Services.Infrastructure.Repositories;

namespace eppoi.Server.Services.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDBContext _context;

        public UnitOfWork(
            ApplicationDBContext context, 
            IPointOfInterestRepository pointOfInterests, 
            ICategoriesRepository categories,
            IEventsRepository events,
            IArticlesRepository articles,
            IOrganizationsRepository organizations
        )
        {
            _context = context;
            PointOfInterests = pointOfInterests;
            Categories = categories;
            Events = events;
            Articles = articles;
            Organizations = organizations;
        }

        public IArticlesRepository Articles { get; }
        public ICategoriesRepository Categories { get; }
        public IEventsRepository Events { get; }
        public IOrganizationsRepository Organizations { get; }
        public IPointOfInterestRepository PointOfInterests { get; }
    }
}
