using eppoi.Models.Entities.Import.Restaurants;

namespace eppoi.Models.Entities.Import
{
    public class Owner
    {
        public string Name { get; set; } = string.Empty;
        public string TaxCode { get; set; } = string.Empty;
        public string? Website { get; set; } = string.Empty;
        public virtual IEnumerable<Restaurant> Restaurants { get; set; } = [];
        public virtual IEnumerable<Shopping> Shoppings { get; set; } = [];
        public virtual IEnumerable<Sleep> Sleeps { get; set; } = [];

        public Owner(Importer.Owner o)
        {
            Name = o.legalName.Trim();
            TaxCode = o.taxCode.Trim();
            Website = o.website;
        }

        public Owner() { }
    }
}
