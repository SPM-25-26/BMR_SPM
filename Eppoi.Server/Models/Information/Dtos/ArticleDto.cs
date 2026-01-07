using eppoi.Models.Entities.Import.Articles;

namespace eppoi.Server.Models.Information.Dtos
{
    public class ArticleDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Script { get; set; }
        public required string SubTitle { get; set; }
        public required string TimeToRead { get; set; }
        public required string ImagePath { get; set; }
        public required string LastUpdate { get; set; }
        public required string Category { get; set; }
        public required IEnumerable<string> Themes { get; set; }
        public required IEnumerable<Paragraph> Paragraphs { get; set; }

    }
}
