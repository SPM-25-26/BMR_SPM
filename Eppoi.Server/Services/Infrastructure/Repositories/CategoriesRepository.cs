using eppoi.Models.Data;
using eppoi.Models.Entities.Import;

namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public class CategoriesRepository(ApplicationDBContext context): Repository<Category>(context), ICategoriesRepository
    {
        public ApplicationDBContext Context
        {
            get { return context; }
        }
    }
}
