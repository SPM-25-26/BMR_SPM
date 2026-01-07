namespace eppoi.Server.Models.Information.Dtos
{
    public class EntertainmentDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string ImagePath { get; set; }
        public required string Address { get; set; }
        public required string Category { get; set; }
        public required IEnumerable<string> Gallery { get; set; }
        public required float Latitude { get; set; }
        public required float Longitude { get; set; }
    }
}
