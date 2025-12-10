namespace eppoi.Models.Entities.Import.ArtNatures
{
    public class CreativeWork
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string ArtCultureId { get; set; } = string.Empty;
        public virtual ArtNature ArtCulture { get; set; } = null!;
    }
}
