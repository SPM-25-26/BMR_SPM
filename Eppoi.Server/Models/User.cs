using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eppoi.Server.Models
{
    public class User : IdentityUser
    {
        [MaxLength(50)]
        public required string Name { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public string? GoogleId { get; set; } = null;


    }
}
