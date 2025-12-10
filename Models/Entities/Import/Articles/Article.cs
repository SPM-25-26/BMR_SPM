namespace eppoi.Models.Entities.Import.Articles
{
    public class Article
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Script { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string TimeToRead { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public IEnumerable<string> Themes { get; set; } = [];
        public virtual IEnumerable<Paragraph> Paragraphs { get; set; } = [];

        public Article() { }

        public Article(Importer.ArticleImport import)
        {
            Id = import.identifier.Trim();
            Title = import.title.Trim();
            Script = import.script.Trim();
            Subtitle = import.subtitle.Trim();
            TimeToRead = import.timeToRead.Trim();
            ImagePath = import.imagePath.Trim();
            UpdatedAt = import.updatedAt;
            Themes = [.. import.themes.Select(t => t.Trim())];
            Paragraphs = [.. import.paragraphs.Select(p => new Paragraph
            {
                Title = p.title.Trim(),
                Script = p.script.Trim(),
                Position = p.position,
                Subtitle = p.subtitle.Trim(),
                CategoryId = p.referenceIdentifier.Trim(),
                Category = p.referenceCategory.Trim(),
                ArticleId = Id
                })];
        }

    }
}
