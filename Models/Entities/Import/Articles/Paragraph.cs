namespace eppoi.Models.Entities.Import.Articles
{
    public class Paragraph
    {
        public int Id { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string Script { get; set; } = string.Empty;
        public int Position { get; set; } = 0;
        public string Subtitle { get; set; } = string.Empty;
        public string CategoryId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ArticleId { get; set; } = string.Empty;
        public virtual Article Article { get; set; } = null!;

        public Paragraph() { }
    }
}
