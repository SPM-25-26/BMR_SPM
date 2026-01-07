using eppoi.Models.Entities.Import.Routes;

namespace eppoi.Server.Models.Information.Dtos
{
    public class RouteDto
    {
        public required string Id { get; set; }
        public required string ImagePath { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Type { get; set; }
        public required string TravellingMethod { get; set; }
        public required string ShortName { get; set; }
        public required string Category { get; set; }
        public required string Website { get; set; }
        public required string Email { get; set; }
        public required string Facebook { get; set; }
        public required string Telephone { get; set; }
        public required string SecurityLevel { get; set; }
        public required int NumberOfStages { get; set; }
        public required int QuantifiedPathwayPaving { get; set; }
        public required string Duration { get; set; }
        public required string RouteLength { get; set; }
        public required IEnumerable<Stage> Stages { get; set; }
        public required StartingPoint StartingPoint { get; set; }
    }
}
