namespace eppoi.Server.Models.Dtos
{
    public class PointOfInterestDto
    {
        public required string EntityId { get; set; }
        public required string EntityName { get; set; }
        public required string ImagePath { get; set; }
        public required string BadgeText { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required float Latitude { get; set; }
        public required float Longitude { get; set; }
        public required string Category { get; set; }
        public IEnumerable<string> Gallery { get; set; }
    }
}
