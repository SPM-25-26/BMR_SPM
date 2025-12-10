namespace eppoi.Models.Importer
{
    public class OrganizationImport
    {
        public string taxCode { get; set; } = string.Empty;
        public string legalName { get; set; } = string.Empty;
        public string primaryImagePath { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string legalStatus { get; set; } = string.Empty;
        public string[] gallery { get; set; } = [];
        public string email { get; set; } = string.Empty;
        public string telephone { get; set; } = string.Empty;
        public string website { get; set; } = string.Empty;
        public string instagram { get; set; } = string.Empty;
        public string facebook { get; set; } = string.Empty;
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public Ownedpoi[] ownedPoi { get; set; } = [];
    }

    public class Ownedpoi
    {
        public string identifier { get; set; } = string.Empty;
        public string category { get; set; } = string.Empty;
    }
}
