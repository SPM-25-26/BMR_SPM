namespace eppoi.Models.Importer
{
    public class ArticleImport
    {
        public string identifier { get; set; } = string.Empty;
        public string title { get; set; } = string.Empty;
        public string script { get; set; } = string.Empty;
        public string subtitle { get; set; } = string.Empty;
        public string timeToRead { get; set; } = string.Empty;
        public string imagePath { get; set; } = string.Empty;
        public Paragraph[] paragraphs { get; set; } = [];
        public DateTime updatedAt { get; set; } = DateTime.Now;
        public string[] themes { get; set; } = [];
    }

    public class Paragraph 
    {   
        public string title { get; set; } = string.Empty;
        public string script { get; set; } = string.Empty;
        public int position { get; set; } = 0;
        public string subtitle { get; set; } = string.Empty;
        public string referenceIdentifier { get; set; } = string.Empty;
        public string referenceCategory { get; set; } = string.Empty;
    }
}
