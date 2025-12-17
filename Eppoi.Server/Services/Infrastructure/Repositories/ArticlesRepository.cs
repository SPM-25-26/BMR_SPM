using eppoi.Models.Data;
using eppoi.Models.Entities.Import.Articles;

namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public class ArticlesRepository(ApplicationDBContext context): Repository<Article>(context), IArticlesRepository
    {
        public ApplicationDBContext Context
        {
            get { return context; }
        }
    }
}
