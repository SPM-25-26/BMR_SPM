using Microsoft.EntityFrameworkCore;

namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public class Repository<TEntity>(DbContext context) : IRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext _context = context;

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }
    }
}
