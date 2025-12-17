using eppoi.Server.Services.Infrastructure.Repositories;

namespace eppoi.Server.Services.Infrastructure
{
    public interface IUnitOfWork
    {
        IArticlesRepository Articles { get; }
        ICategoriesRepository Categories { get; }
        IEventsRepository Events { get; }
        IOrganizationsRepository Organizations { get; }
        IPointOfInterestRepository PointOfInterests { get; }
    }
}
