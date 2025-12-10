namespace eppoi.Server.Models.Authentication
{
    public class Email
    {
        public required string Reciever { get; set; } = string.Empty;
        public required string Title { get; set; } = string.Empty;
        public required string Body { get; set; } = string.Empty;
    }
}
