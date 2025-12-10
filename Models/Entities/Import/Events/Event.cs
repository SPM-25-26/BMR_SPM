using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Events
{
    public class Event
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Typology { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;
        public string? Date { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public int OrganizerId { get; set; } = 0;
        public virtual Organizer Organizer { get; set; } = new Organizer();

        public Event() { }

        public Event(EventImport import)
        {
            Id = import.identifier;
            Title = import.title;
            Address = import.address;
            Description = import.description;
            Typology = import.typology;
            Image = import.primaryImage;
            Audience = import.audience;
            Latitude = import.latitude;
            Longitude = import.longitude;
            Date = import.date;
            StartDate = import.startDate;
            EndDate = import.endDate;
        }
    }
}
