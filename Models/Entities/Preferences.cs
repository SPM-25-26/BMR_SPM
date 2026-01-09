using System.Text.Json.Serialization;

namespace eppoi.Models.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [Flags]
    public enum Preferences
    {
        P_ArtCulture = 1 << 0,
        P_Nature = 1 << 1,
        P_Entertainment = 1 << 2,
        P_Restaurant = 1 << 3,
        P_Sleep = 1 << 4,
        P_Event = 1 << 5,
        P_Route = 1 << 6,
        P_Article = 1 << 7,
        P_Shopping = 1 << 8,
        P_Organization = 1 << 9,
        T_Solo = 1 << 10,
        T_Couple = 1 << 11,
        T_Family = 1 << 12,
        T_Friends = 1 << 13,
        F_GlutenFree = 1 << 14,
        F_DairyFree = 1 << 15,
        F_Vegetarian = 1 << 16
    }
}
