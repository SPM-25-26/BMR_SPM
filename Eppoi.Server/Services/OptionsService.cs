using eppoi.Models.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace eppoi.Server.Services
{
    public class OptionsService(UserManager<User> userService)
    {
        private readonly UserManager<User> _userManager = userService;
        public async Task<IdentityResult> ChangePreferences(IEnumerable<Preferences> changes, string userName)
        {
            var user = _userManager.FindByNameAsync(userName);
            
            if (user.Result == null)
                return IdentityResult.Failed();

            Preferences pref = 0;
            pref = changes.Aggregate(pref, (current, pref) => pref | current);

            user.Result.Preferences = pref;
            return await _userManager.UpdateAsync(user.Result);
        }
    }
}
