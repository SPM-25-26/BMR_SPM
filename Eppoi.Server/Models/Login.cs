namespace Eppoi.Server.Models
{
    public class Login
    {
        public required string UserOrEmail { get; set; }
        public required string Password { get; set; }        
    }
}
