using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Restaurants
{
    public class Restaurant
    {
        public string Id { get; set; } = string.Empty;
        public string PrimaryImagePath { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Telephone { get; set; } = string.Empty;
        public string? Facebook { get; set; } = string.Empty;
        public string? Instagram { get; set; } = string.Empty;
        public string? Website { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string[] Gallery { get; set; } = [];
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;
        public int OpeningHoursId { get; set; } = 0;
        public virtual OpeningHours OpeningHours { get; set; } = new OpeningHours();
        public string[]? DietaryNeeds { get; set; } = [];
        public string OwnerId { get; set; } = string.Empty;
        public virtual Owner Owner { get; set; } = new Owner();

        public Restaurant() { }

        public Restaurant(RestaurantImport import)
        {
            Id = import.identifier.Trim();
            PrimaryImagePath = import.primaryImagePath.Trim();
            Name = import.officialName.Trim();
            Address = import.address.Trim();
            Description = import.description.Trim();
            Email = import.email;
            Telephone = import.telephone;
            Facebook = import.facebook;
            Instagram = import.instagram;
            Website = import.website;
            Type = import.type;
            Gallery = import.gallery;
            Latitude = import.latitude;
            Longitude = import.longitude;
            DietaryNeeds = import.dietaryNeeds;
        }
    }
}
