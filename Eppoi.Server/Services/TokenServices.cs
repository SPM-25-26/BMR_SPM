using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Eppoi.Server.Models;
using Eppoi.Server.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace Eppoi.Server.Services
{
    public class TokenService(IOptions<TokenOption> option)
    {
        private readonly Eppoi.Server.Options.TokenOption _jwtAuthenticationOption = option.Value;

        public string CreateToken(bool valid, User user)
        {
            if (valid)
            {
                List<Claim> claims =
                [
                    new Claim("Name", user.Name),
                    new Claim("UserName", user.UserName),
                ];
                var token = GetJwtSecurityToken(claims);
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            else return string.Empty;
        }

        private JwtSecurityToken GetJwtSecurityToken(List<Claim> claims)
        {
            return new JwtSecurityToken(_jwtAuthenticationOption.Issuer,
                null,
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: GetCredentials());
        }

        private SigningCredentials GetCredentials()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtAuthenticationOption.Key));
            return new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        }

    }
}
