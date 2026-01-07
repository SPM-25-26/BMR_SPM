namespace eppoi.Models.Entities.Import.ArtNatures
{
    public class CreativeWork
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string ArtNatureId { get; set; } = string.Empty;
        public virtual ArtNature ArtNature { get; set; } = null!;
    }
}
