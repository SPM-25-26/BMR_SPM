namespace eppoi.Models.Importer
{
    public class RestaurantImport
    {
        public string identifier { get; set; } = string.Empty;
        public string primaryImagePath { get; set; } = string.Empty;
        public string officialName { get; set; } = string.Empty;
        public string address { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string telephone { get; set; } = string.Empty;
        public string facebook { get; set; } = string.Empty;
        public string instagram { get; set; } = string.Empty;
        public string website { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public string[] gallery { get; set; } = [];
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public Openinghours openingHours { get; set; } = new Openinghours();
        public string[] dietaryNeeds { get; set; } = [];
        public Owner owner { get; set; } = new Owner();
    }

    public class Openinghours
    {
        public string opens { get; set; } = string.Empty;
        public string closes { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public Admissiontype admissionType { get; set; } = new Admissiontype();
    }

    public class Admissiontype
    {
        public string name { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
    }
    
    public class Owner
    {
        public string taxCode { get; set; } = string.Empty;
        public string legalName { get; set; } = string.Empty;
        public string website { get; set; } = string.Empty;
    } 
}
