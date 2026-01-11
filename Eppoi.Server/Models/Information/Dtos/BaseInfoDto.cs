namespace eppoi.Server.Models.Information.Dtos
{
    public class BaseInfoDto
    {
        public string? Date { get; set; }
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string ImagePath { get; set; }
        public required string BadgeText { get; set; }
        public required string Category { get; set; }
        public string? Address { get; set; }
        public string? Audience { get; set; }
        public IEnumerable<string>? DietaryNeeds { get; set; }
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
    }
}
