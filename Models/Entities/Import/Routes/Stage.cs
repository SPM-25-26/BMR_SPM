namespace eppoi.Models.Entities.Import.Routes
{
    public class Stage
    {
        public int Id { get; set; }
        public string PoiId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ThumbImagePath { get; set; } = string.Empty;
        public string SignPosting { get; set; } = string.Empty;
        public string SupportService { get; set; } = string.Empty;
        public string ShortName { get; set; } = string.Empty;
        public int Order { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
        public string RouteId { get; set; } = string.Empty;
        public virtual Route Route { get; set; } = new Route();

        public Stage() { }
    }
}
