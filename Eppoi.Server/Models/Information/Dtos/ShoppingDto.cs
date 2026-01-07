using eppoi.Models.Entities.Import;

namespace eppoi.Server.Models.Information.Dtos
{
    public class ShoppingDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required string ImagePath { get; set; }
        public required float Latitude { get; set; }
        public required float Longitude { get; set; }
        public required string Category { get; set; }
        public required string Email { get; set; }
        public required string Website { get; set; }
        public  required string Facebook { get; set; }
        public required string Instagram { get; set; }
        public required string Telephone { get; set; }
        public required Owner Owner { get; set; }
        public required IEnumerable<string> Gallery { get; set; }
    }
}
