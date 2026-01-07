using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Routes
{
    public class Route
    {
        public string Id { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string TravellingMethod { get; set; } = string.Empty;
        public string ShortName { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Facebook { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string SecurityLevel { get; set; } = string.Empty;
        public int NumberOfStages { get; set; } = 0;
        public int QuantifiedPathwayPaving { get; set; } = 0;
        public string Duration { get; set; } = string.Empty;
        public string RouteLength { get; set; } = string.Empty;
        public virtual IEnumerable<Stage> Stages { get; set; } = [];
        public int StartingPointId { get; set; } = 0;
        public virtual StartingPoint StartingPoint { get; set; } = new StartingPoint();

        public Route() { }

        public Route(RouteImport import)
        {
            Id = import.number;
            ImagePath = import.imagePath;
            Name = import.name;
            Description = import.description;
            Type = import.pathTheme;
            TravellingMethod = import.travellingMethod;
            ShortName = import.shortName;
            Website = import.organizationWebsite ?? string.Empty;
            Email = import.organizationEmail ?? string.Empty;
            Facebook = import.organizationFacebook ?? string.Empty;
            Telephone = import.organizationTelephone ?? string.Empty;
            SecurityLevel = import.securityLevel;
            NumberOfStages = import.numberOfStages;
            QuantifiedPathwayPaving = import.quantifiedPathwayPaving;
            Duration = import.duration;
            RouteLength = import.routeLength;
            Stages = [.. import.stages.Select(s => new Stage
            {
                PoiId = s.poiIdentifier,
                Category = s.category,
                ThumbImagePath = s.poiImageThumbPath,
                SignPosting = s.signposting,
                SupportService = s.supportService,
                ShortName = s.name,
                Order = s.number,
                Description = s.description,
                RouteId = Id!
            })];
        }
    }
}
