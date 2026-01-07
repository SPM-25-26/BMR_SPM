using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import
{
    public class Sleep
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Classification { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public IEnumerable<string> Gallery { get; set; } = [];
        public IEnumerable<string> Services { get; set; } = [];
        public string Address { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Facebook { get; set; } = string.Empty;
        public string Instagram { get; set; } = string.Empty;
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;
        public string OwnerId { get; set; } = string.Empty;
        public virtual Owner Owner { get; set; } = null!;

        public Sleep() { }

        public Sleep(SleepImport import)
        {
            Id = import.identifier.Trim();
            Name = import.officialName.Trim();
            Description = import.description.Trim();
            Classification = import.classification.Trim();
            Type = import.typology.Trim();
            ImagePath = import.primaryImage.Trim();
            Gallery = import.gallery;
            Services = import.services ?? [];
            Email = import.email == null ? string.Empty : import.email.Trim();
            Telephone = import.telephone == null ? string.Empty : import.telephone.Trim();
            Website = import.website == null ? string.Empty : import.website.Trim();
            Instagram = import.instagram == null ? string.Empty : import.instagram.Trim();
            Facebook = import.facebook == null ? string.Empty : import.facebook.Trim();
            Latitude = import.latitude;
            Longitude = import.longitude;
            Address = import.shortAddress.Trim();
        }
    }
}
