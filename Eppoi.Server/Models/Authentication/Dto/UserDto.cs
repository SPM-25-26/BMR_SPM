using eppoi.Models.Entities;

namespace eppoi.Server.Models.Authentication.Dto
{
    public class UserDto
    {
        public required string Name { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required IEnumerable<Preferences> Preferences { get; set; }
    }
}
