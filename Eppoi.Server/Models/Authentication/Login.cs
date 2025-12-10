namespace eppoi.Server.Models.Authentication
{
    public class Login
    {
        public required string UserOrEmail { get; set; }
        public required string Password { get; set; }        
    }
}
