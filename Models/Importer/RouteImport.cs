namespace eppoi.Models.Importer
{
    public class RouteImport
    {
        public string imagePath { get; set; } = string.Empty;
        public string number { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string pathTheme { get; set; } = string.Empty;
        public string travellingMethod { get; set; } = string.Empty;
        public string shortName { get; set; } = string.Empty;
        public string organizationWebsite { get; set; } = string.Empty;
        public string organizationEmail { get; set; } = string.Empty;
        public string organizationFacebook { get; set; } = string.Empty;
        public string organizationTelephone { get; set; } = string.Empty;
        public string securityLevel { get; set; } = string.Empty;
        public int numberOfStages { get; set; } = 0;
        public int quantifiedPathwayPaving { get; set; } = 0;
        public string duration { get; set; } = string.Empty;
        public string routeLength { get; set; } = string.Empty;
        public Stage[] stages { get; set; } = [];
        public Startingpoint startingPoint { get; set; } = new Startingpoint();
    }

    public class Startingpoint
    {
        public float latitude { get; set; } = 0;
        public float longitude { get; set; } = 0;
        public string address { get; set; } = string.Empty;
    }

    public class Stage
    {
        public string category { get; set; } = string.Empty;
        public string poiIdentifier { get; set; } = string.Empty;
        public string poiOfficialName { get; set; } = string.Empty;
        public string poiImagePath { get; set; } = string.Empty;
        public string poiImageThumbPath { get; set; } = string.Empty;
        public string signposting { get; set; } = string.Empty;
        public string supportService { get; set; } = string.Empty;
        public float poiLatitude { get; set; } = 0;
        public float poiLongitude { get; set; } = 0;
        public string poiAddress { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public int number { get; set; } = 0;
        public string description { get; set; } = string.Empty;
    }
}
