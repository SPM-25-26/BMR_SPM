namespace eppoi.Models.Entities.Import.Events
{
    public class Organizer
    {
        public int Id { get; set; } = 0;
        public string? Name { get; set; } = string.Empty;
        public string? TaxCode { get; set; } = string.Empty;
        public string? Website { get; set; } = string.Empty;
        public virtual IEnumerable<Event> Events { get; set; } = [];

        public Organizer() { }
    }
}
