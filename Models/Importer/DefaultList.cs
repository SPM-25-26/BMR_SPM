namespace eppoi.Models.Importer
{
    public class DefaultList
    {
        public Default[] Defaults { get; set; } = [];
    }

    public class Default
    {
        public string entityId { get; set; } = string.Empty;
        public string entityName { get; set; } = string.Empty;
        public string imagePath { get; set; } = string.Empty;
        public string badgeText { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
    }
}
