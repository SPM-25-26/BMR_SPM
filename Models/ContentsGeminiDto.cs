namespace eppoi.Models
{
    public class ContentsGeminiDto
    {
        public Content[] contents { get; set; }

        public class Content
        {
            public string role { get; set; }
            public Part[] parts { get; set; }
        }

        public class Part
        {
            public string text { get; set; }
        }
    }
}
