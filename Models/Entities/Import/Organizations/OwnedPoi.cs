namespace eppoi.Models.Entities.Import.Organizations
{
    public class OwnedPoi
    {
        public int Id { get; set; }
        public string PoiId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string OrganizationId { get; set; } = string.Empty;
        public virtual Organization Organization { get; set; } = null!;

        public OwnedPoi() { }
    }
}
