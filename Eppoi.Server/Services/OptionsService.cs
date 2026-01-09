using eppoi.Models.Data;
using eppoi.Models.Entities;
using eppoi.Server.Models.Options.Dto;

namespace eppoi.Server.Services
{
    public class OptionsService(ApplicationDBContext _context)
    {
        public async Task<int> ChangePreferences(PreferencesDto changes)
        {
            var user = await _context.Users.FindAsync(changes.Id);
            
            if (user == null)
                return -1;

            Preferences pref = 0;
            pref = changes.Preferences.Aggregate(pref, (current, pref) => pref | current);

            user.Preferences = pref;

            return _context.SaveChanges();
        }
    }
}
