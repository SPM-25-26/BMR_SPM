using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.ArtNatures
{
    public class ArtNature
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public IEnumerable<string>? Gallery { get; set; } = [];
        public string Address { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Category { get; set; } = string.Empty;
        public virtual IEnumerable<Catalogue> Catalogues { get; set; } = [];
        public virtual IEnumerable<CreativeWork> CreativeWorks { get; set; } = [];
        public virtual ArtNature? Site { get; set; } = null!;

        public ArtNature() { }

        public ArtNature(ArtNatureImport import, string type)
        {
            Id = import.identifier.Trim();
            Name = import.officialName.Trim();
            ImagePath = import.primaryImagePath.Trim();
            Gallery = [.. import.gallery.Select(img => img.Trim())];
            Address = import.fullAddress.Trim();
            Type = import.type.Trim();
            Description = import.description.Trim();
            Latitude = import.latitude;
            Longitude = import.longitude;
            Category = type.Trim();
            Catalogues = [.. import.catalogues.Select(c => new Catalogue
            {
                Name = c.name.Trim(),
                WebsiteUrl = c.websiteUrl.Trim(),
                Description = c.description.Trim(),
                ArtNatureId = Id
            })];

            CreativeWorks = [.. import.creativeWorks.Select(cw => new CreativeWork
            {
                Type = cw.type.Trim(),
                Url = cw.url.Trim(),
                ArtNatureId = Id
            })];
        }
    }
}
