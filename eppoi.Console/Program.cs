using Eppoi.Server.Data;
using Eppoi.Server.Models;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateDefaultBuilder(args);

builder.ConfigureAppConfiguration((context, config) =>
{
    config.AddJsonFile("appsettings.json", optional: true);
    config.AddUserSecrets<Program>();
});

builder.ConfigureServices((context, services) =>
{
    var connectionString = context.Configuration["ConnectionString:Default"];

    // Registra DbContext (nota: ApplicationDBContext con "DB" maiuscolo)
    services.AddDbContext<ApplicationDBContext>(options =>
        options.UseSqlServer(connectionString));

    // Registra Identity
    services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDBContext>()
        .AddDefaultTokenProviders();
    
    // Registra il servizio
    services.AddScoped<MockImportService>();
});

var host = builder.Build();

// Esegui il comando
using (var scope = host.Services.CreateScope())
{
    var service = scope.ServiceProvider.GetRequiredService<MockImportService>();
    await service.PrintUsers();
}

global::System.Console.WriteLine("Operazione completata. Premi un tasto per uscire...");
global::System.Console.ReadKey();
