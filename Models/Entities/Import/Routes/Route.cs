using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Routes
{
    public class Route
    {
        public string? Id { get; set; } = null!;
        public string ImagePath { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PathTheme { get; set; } = string.Empty;
        public string TravellingMethod { get; set; } = string.Empty;
        public string ShortName { get; set; } = string.Empty;
        public string OrganizationWebsite { get; set; } = string.Empty;
        public string OrganizationEmail { get; set; } = string.Empty;
        public string OrganizationFacebook { get; set; } = string.Empty;
        public string OrganizationTelephone { get; set; } = string.Empty;
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
            PathTheme = import.pathTheme;
            TravellingMethod = import.travellingMethod;
            ShortName = import.shortName;
            OrganizationWebsite = import.organizationWebsite ?? string.Empty;
            OrganizationEmail = import.organizationEmail ?? string.Empty;
            OrganizationFacebook = import.organizationFacebook ?? string.Empty;
            OrganizationTelephone = import.organizationTelephone ?? string.Empty;
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
