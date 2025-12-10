namespace eppoi.Models.Importer
{

    public class ArtNatureImport
    {
        public string identifier { get; set; } = string.Empty;
        public string officialName { get; set; } = string.Empty;
        public string primaryImagePath { get; set; } = string.Empty;
        public string fullAddress { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public Catalogue[] catalogues { get; set; } = [];
        public Creativework[] creativeWorks { get; set; } = [];
        public string[] gallery { get; set; } = [];
        public string description { get; set; } = string.Empty;
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public Site site { get; set; } = new Site();
    }

    public class Site
    {
        public string identifier { get; set; } = string.Empty;
        public string officialName { get; set; } = string.Empty;
        public string imagePath { get; set; } = string.Empty;
        public string category { get; set; } = string.Empty;
    }

    public class Catalogue
    {
        public string name { get; set; } = string.Empty;
        public string websiteUrl { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
    }

    public class Creativework
    {
        public string type { get; set; } = string.Empty;
        public string url { get; set; } = string.Empty;
    }
}
