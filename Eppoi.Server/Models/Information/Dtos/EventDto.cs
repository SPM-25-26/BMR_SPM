using eppoi.Models.Entities.Import.Events;

namespace eppoi.Server.Models.Information.Dtos
{
    public class EventDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required string BadgeText { get; set; }
        public required string ImagePath { get; set; }
        public required float Latitude { get; set; }
        public required float Longitude { get; set; }
        public required string Category { get; set; }
        public required string Audience { get; set; }
        public required string Date {  get; set; }
        public required Organizer Organizer { get; set; }
    }
}
