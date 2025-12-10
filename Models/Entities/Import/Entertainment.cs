using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import
{
    public class Entertainment
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public IEnumerable<string>? Gallery { get; set; } = [];
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;

        public Entertainment() { }

        public Entertainment(EntertainmentImport import)
        {
            Id = import.identifier;
            Name = import.officialName;
            Address = import.address;
            Description = import.description;
            Category = import.category;
            ImagePath = import.primaryImage;
            Gallery = import.gallery;
            Latitude = import.latitude;
            Longitude = import.longitude;
        }
    }
}
