namespace eppoi.Models.Importer
{
    public class SleepImport
    {
        public string identifier { get; set; } = string.Empty;
        public string officialName { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string classification { get; set; } = string.Empty;
        public string typology { get; set; } = string.Empty;
        public string primaryImage { get; set; } = string.Empty;
        public string[] gallery { get; set; } = [];
        public string[] services { get; set; } = [];
        public string email { get; set; } = string.Empty;
        public string telephone { get; set; } = string.Empty;
        public string website { get; set; } = string.Empty;
        public string instagram { get; set; } = string.Empty;
        public string facebook { get; set; } = string.Empty;
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public Owner owner { get; set; } = new Owner();
        public string shortAddress { get; set; } = string.Empty;
    }
}
