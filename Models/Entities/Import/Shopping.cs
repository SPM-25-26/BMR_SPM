using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import
{
    public class Shopping
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Facebook { get; set; } = string.Empty;
        public string Instagram { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string OwnerId { get; set; } = string.Empty;
        public virtual Owner Owner { get; set; } = new Owner();
        public IEnumerable<string> Gallery { get; set; } = [];

        public Shopping() { }

        public Shopping(ShoppingImport import)
        {
            Id = import.identifier;
            Name = import.officialName;
            Address = import.address;
            Description = import.description;
            ImagePath = import.imagePath;
            Latitude = import.latitude;
            Longitude = import.longitude;
            Email = import.email;
            Website = import.website;
            Facebook = import.facebook ?? string.Empty;
            Instagram = import.instagram ?? string.Empty;
            Telephone = import.telephone;
            Gallery = import.gallery;
        }
    }
}
