using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace eppoi.Models.Entities
{
    public class User : IdentityUser
    {
        [MaxLength(50)]
        public required string Name { get; set; }

        public string? GoogleId { get; set; } = null;
        public string? FacebookId { get; set; } = null;

        public Preferences Preferences { get; set; }

    }
}
