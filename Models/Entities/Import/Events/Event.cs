using eppoi.Models.Importer;

namespace eppoi.Models.Entities.Import.Events
{
    public class Event
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;
        public DateTime? Date { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int OrganizerId { get; set; } = 0;
        public virtual Organizer Organizer { get; set; } = new Organizer();

        public Event() { }

        public Event(EventImport import)
        {
            Id = import.identifier;
            Name = import.title;
            Address = import.address;
            Description = import.description;
            Type = import.typology;
            ImagePath = import.primaryImage;
            Audience = import.audience;
            Latitude = import.latitude;
            Longitude = import.longitude;
            if (DateTime.TryParse(import.date, out var date)) Date = date;
            if (DateTime.TryParse(import.startDate, out var start)) StartDate = start;
            if (DateTime.TryParse(import.endDate, out var end)) EndDate = end;
        }

        public string GetDateString()
        {
            if (Date.HasValue)
                return Date.Value.ToString("d");
            
            if (StartDate.HasValue)
                return StartDate.Value.ToString("d") + (EndDate.HasValue
                    ? " - " + EndDate.Value.ToString("d")
                    : string.Empty);
            return string.Empty;
        }
    }
}
