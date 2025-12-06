using Eppoi.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Eppoi.Server.Services
{
    public class MockImportService(UserManager<User> userManager)
    {
        private readonly UserManager<User> _userManager = userManager;

        public async Task PrintUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            
            var usersData = users.Select(user => new
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Name = user.Name,
                EmailConfirmed = user.EmailConfirmed,
                CreatedDate = user.CreatedDate,
                GoogleId = user.GoogleId
            });

            var json = JsonSerializer.Serialize(usersData, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            Console.WriteLine("=== Users List ===");
            Console.WriteLine(json);
            Console.WriteLine("==================");
        }
    }
}