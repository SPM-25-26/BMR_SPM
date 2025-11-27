namespace eppoi.Server.Models
{
    public class CreateTokenRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
