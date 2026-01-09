using System.Text.Json.Serialization;

namespace eppoi.Models.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [Flags]
    public enum Preferences
    {
        P_ArtCultures = 1 << 0,
        P_Natures = 1 << 1,
        P_Entertainments = 1 << 2,
        P_Restaurants = 1 << 3,
        P_Sleeps = 1 << 4,
        P_Events = 1 << 5,
        P_Routes = 1 << 6,
        P_Articles = 1 << 7,
        P_Shoppings = 1 << 8,
        P_Organizations = 1 << 9,
    }
}
