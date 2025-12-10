namespace eppoi.Models.Importer
{
    public class ShoppingImport
    {
        public string identifier { get; set; } = string.Empty;
        public string officialName { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string imagePath { get; set; } = string.Empty;
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public string email { get; set; } = string.Empty;
        public string website { get; set; } = string.Empty;
        public string facebook { get; set; } = string.Empty;
        public string instagram { get; set; } = string.Empty;
        public string telephone { get; set; } = string.Empty;
        public Owner owner { get; set; } = new Owner();
        public string[] gallery { get; set; } = [];
    }
}