namespace eppoi.Models.Entities.Import.ArtNatures
{
    public class Catalogue
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string WebsiteUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ArtCultureId { get; set; } = string.Empty;
        public virtual ArtNature ArtCulture { get; set; } = null!;
    }
}
