using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Restaurants
{
    public class OpeningHours
    {
        public int Id { get; set; }
        public string Opens { get; set; } = string.Empty;
        public string Closes { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AdmissionType { get; set; } = string.Empty;
        public virtual IEnumerable<Restaurant> Restaurants { get; set; } = [];

        public OpeningHours(Openinghours op)
        {
            Opens = op.opens.Trim();
            Closes = op.closes.Trim();
            Description = op.description.Trim();
            AdmissionType = op.admissionType.name.Trim();
        }

        public OpeningHours() { }
    }
}
