using eppoi.Models.Entities;
using eppoi.Server.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace eppoi.Server.Services
{
    public class OptionsService(UserManager<User> userService) : IOptionsService
    {
        private readonly UserManager<User> _userManager = userService;

        public async Task<IdentityResult> ChangePreferences(IEnumerable<Preferences> changes, string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            
            if (user == null)
                return IdentityResult.Failed();

            Preferences pref = 0;
            pref = changes.Aggregate(pref, (current, pref) => pref | current);

            user.Preferences = pref;
            return await _userManager.UpdateAsync(user);
        }
    }
}
