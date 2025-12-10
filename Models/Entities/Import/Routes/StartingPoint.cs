namespace eppoi.Models.Entities.Import.Routes
{
    public class StartingPoint
    {
        public int Id { get; set; } = 0;
        public float Latitude { get; set; } = 0;
        public float Longitude { get; set; } = 0;
        public string Address { get; set; } = string.Empty;
        public virtual IEnumerable<Route> Routes { get; set; } = [];

        public StartingPoint() { }
    }
}
