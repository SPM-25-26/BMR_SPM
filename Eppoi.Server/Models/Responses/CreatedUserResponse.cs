using eppoi.Models.Entities;
using eppoi.Server.Models.Options;

namespace eppoi.Server.Models.Responses
{
    public class CreateUserResponse
    {
        public string? Name { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Message { get; set; }
        public string? Preferences { get; set; }

    }
}
