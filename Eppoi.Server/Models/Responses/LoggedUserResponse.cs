using eppoi.Models.Entities;

namespace eppoi.Server.Models.Responses
{
    public class LoggedUserResponse
    {
        public string? Token { get; set; } = null;
        public Preferences? Preferences { get; set; } = null;

    }
}
