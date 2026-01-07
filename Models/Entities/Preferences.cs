namespace eppoi.Models.Entities
{
    public class Preferences
    {
        public string UserId { get; set; } = string.Empty;
        public virtual User User { get; set; } = null!;
        public int ArtCultures { get; set; } = 0;
        public int Natures { get; set; } = 0;
        public int Entertainments { get; set; } = 0;
        public int Restaurants { get; set; } = 0;
        public int Sleeps { get; set; } = 0;
        public int Events { get; set; } = 0;
        public int Routes { get; set; } = 0;
        public int Articles { get; set; } = 0;
        public int Shoppings {  get; set; } = 0;
        public int Organizations { get; set; } = 0;
    }
}
