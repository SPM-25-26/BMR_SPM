namespace eppoi.Server.Services.Infrastructure.Repositories
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
    }
}
