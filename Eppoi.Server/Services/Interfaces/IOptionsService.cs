using eppoi.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace eppoi.Server.Services.Interfaces
{
    public interface IOptionsService
    {
        public Task<IdentityResult> ChangePreferences(IEnumerable<Preferences> changes, string userName);
    }
}
