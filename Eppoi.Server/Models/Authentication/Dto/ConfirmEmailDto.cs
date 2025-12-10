namespace eppoi.Server.Models.Authentication.Dto
{
    public class ConfirmEmailDto
    {
        public required string Id { get; set; } = string.Empty;
        public required string Token { get; set; } = string.Empty;
    }
}
