namespace eppoi.Server.Models.Dto
{
    public class ConfirmEmailDto
    {
        public required string Email { get; set; } = string.Empty;
        public required string Token { get; set; } = string.Empty;
    }
}
