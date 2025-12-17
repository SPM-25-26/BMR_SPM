using eppoi.Server.Models.Dtos;
using Eppoi.Server.Models.LocalInfo.Enums;

namespace eppoi.Server.Services
{
    public interface ILocalInfoService
    {
        Task<IEnumerable<CategoryDto>> GetCategories();
        Task<IEnumerable<DiscoverItemDto>> GetDiscoverListByType(DiscoverType type);
    }
}