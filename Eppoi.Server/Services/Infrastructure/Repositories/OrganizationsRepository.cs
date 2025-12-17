using eppoi.Models.Data;
using eppoi.Models.Entities.Import.Organizations;

namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public class OrganizationsRepository(ApplicationDBContext context): Repository<Organization>(context), IOrganizationsRepository
    {
        public ApplicationDBContext Context
        {
            get { return context; }
        }
    }
}
