namespace eppoi.Server.Models
{
    public class Email
    {
        public required string email { get; set; } = string.Empty;
        public required string title { get; set; } = string.Empty;
        public required string body { get; set; } = string.Empty;
    }
}
