namespace eppoi.Server.Models.Dto
{
    public class PasswordResetDto
    {
        public required string Email { get; set; } = string.Empty;
        public required string Token { get; set; } = string.Empty;
        public required string NewPassword { get; set; } = string.Empty;
    }
}
