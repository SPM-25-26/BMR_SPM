namespace eppoi.Server.Models.Dtos
{
    public class DiscoverItemDto
    {
        public string? Date { get; set; }
        public required string EntityId { get; set; }
        public required string EntityName { get; set; }
        public required string ImagePath { get; set; }
        public required string BadgeText { get; set; }
        public string? Address { get; set; }
    }
}
