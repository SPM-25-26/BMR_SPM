using eppoi.Server.Models;
using Google.Apis.Auth;
using Newtonsoft.Json;

namespace eppoi.Server.Services
{
    public class GoogleValidationService
    {

        private readonly string _googleUserInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        public async Task<GoogleJsonWebSignature.Payload> ValidateIdToken(string idToken)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

            if (payload == null || string.IsNullOrEmpty(payload.Email))
                throw new UnauthorizedAccessException("Invalid Google Token");

            return payload;
        }

        public async Task<GoogleUserProfile> ValidateAccessToken(string accessToken)
        {
            using var httpClient = new HttpClient();

            // Send GET request to Google UserInfo API
            var response = await httpClient.GetAsync($"{_googleUserInfoUrl}?access_token={accessToken}");
            response.EnsureSuccessStatusCode();

            // Parse the JSON response
            var content = await response.Content.ReadAsStringAsync();
            var userProfile = JsonConvert.DeserializeObject<GoogleUserProfile>(content);

            return userProfile!;
        }
    }
}
