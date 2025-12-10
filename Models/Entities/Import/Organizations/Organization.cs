using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Organizations
{
    public class Organization
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string LegalStatus { get; set; } = string.Empty;
        public IEnumerable<string> Gallery { get; set; } = [];
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Instagram { get; set; } = string.Empty;
        public string Facebook { get; set; } = string.Empty;
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;
        public IEnumerable<OwnedPoi> OwnedPois { get; set; } = [];

        public Organization() { }

        public Organization(OrganizationImport import)
        {
            Id = import.taxCode.Trim();
            Name = import.legalName.Trim();
            ImagePath = import.primaryImagePath.Trim();
            Type = import.type == null ? string.Empty : import.type.Trim();
            Address = import.address.Trim();
            Description = import.description.Trim();
            LegalStatus = import.legalStatus.Trim();
            Gallery = import.gallery ?? [];
            Email = import.email == null ? string.Empty : import.email.Trim();
            Telephone = import.telephone == null ? string.Empty : import.telephone.Trim();
            Website = import.website == null ? string.Empty : import.website.Trim();
            Instagram = import.instagram == null ? string.Empty : import.instagram.Trim();
            Facebook = import.facebook == null ? string.Empty : import.facebook.Trim();
            Latitude = import.latitude;
            Longitude = import.longitude;
            OwnedPois = [.. import.ownedPoi.Select(op => new OwnedPoi
            {
                PoiId = op.identifier.Trim(),
                Category = op.category.Trim(),
                OrganizationId = Id
            })];
        }
    }
}
