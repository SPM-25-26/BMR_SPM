using eppoi.Models.Data;
using eppoi.Models.Entities.Import.ArtNatures;

namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public class PointOfInterestRepository(ApplicationDBContext context): Repository<ArtNature>(context), IPointOfInterestRepository
    {
        public ApplicationDBContext Context
        {
            get { return context; }
        }
    }
}
