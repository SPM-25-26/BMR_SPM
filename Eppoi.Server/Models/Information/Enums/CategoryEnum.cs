using System.Text.Json.Serialization;

namespace eppoi.Server.Models.Information.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CategoryEnum
    {
        Poi,
        Event,
        Article,
        Organization,
        Restaurant,
        Sleep,
        Shopping,
        Route,
        Entertainment
    }
}