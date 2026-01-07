using eppoi.Models.Entities.Import.ArtNatures;

namespace eppoi.Server.Models.Information.Dtos
{
    public class PoiDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string ImagePath { get; set; }
        public required string Type { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required float Latitude { get; set; }
        public required float Longitude { get; set; }
        public required string Category { get; set; }
        public required IEnumerable<string> Gallery { get; set; }
        public required IEnumerable<Catalogue> Catalogues { get; set; }
        public required IEnumerable<CreativeWork> CreativeWorks { get; set; }
        public ArtNature? Site { get; set; }

    }
}
