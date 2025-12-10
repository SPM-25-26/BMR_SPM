using eppoi.Console;
using eppoi.Models.Data;
using eppoi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

var builder = Host.CreateDefaultBuilder(args);

builder.ConfigureServices((context, services) =>
{
    var connectionString = context.Configuration["ConnectionString:Default"];

    services.AddDbContext<ApplicationDBContext>(options =>
        options.UseSqlServer(connectionString));

    services.AddIdentityCore<User>(options =>
    {
        options.SignIn.RequireConfirmedAccount = true;

        options.Password.RequireDigit = true;
        options.Password.RequireUppercase = true;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = true;

        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;

        options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDBContext>();

    services.AddScoped<ImporterService>(); 

    services.AddSingleton(context.Configuration.GetSection("Links").Get<Link>());
});

var host = builder.Build();

using (var scope = host.Services.CreateScope())
{
    var importer = scope.ServiceProvider.GetRequiredService<ImporterService>();
    importer.Import();
}

Console.WriteLine("Operazione completata. Premi un tasto per uscire...");
Console.ReadKey();