using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace eppoi.Models.Entities
{
    public class User : IdentityUser
    {
        [MaxLength(50)]
        public required string Name { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string? GoogleId { get; set; } = null;


    }
}
