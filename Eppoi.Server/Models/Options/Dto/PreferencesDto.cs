using eppoi.Models.Entities;

namespace eppoi.Server.Models.Options.Dto
{
    public class PreferencesDto
    {
        public required string Id { get; set; }
        public required IEnumerable<Preferences> Preferences { get; set; }
    }
}
