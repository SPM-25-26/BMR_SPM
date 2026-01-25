using eppoi.Console;
using eppoi.Models;
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
    services.Configure<GoogleGeminiOptions>(context.Configuration.GetSection("Google"));
    services.AddScoped<GeminiService>();
    services.AddSingleton(context.Configuration.GetSection("Links").Get<Link>());
});

var host = builder.Build();

Console.WriteLine("I to Import, G to Ingest Data.");
var x = Console.ReadLine();
using var scope = host.Services.CreateScope();

switch (x.ToLower())
{
    case "i":
        var importer = scope.ServiceProvider.GetRequiredService<ImporterService>();
        importer.Import();
        break;
    case "g":
        var gemini = scope.ServiceProvider.GetRequiredService<GeminiService>();
        Console.WriteLine("File Uploaded: \n");
        Console.WriteLine(gemini.IngestFileToGemini("ragdata.json").GetAwaiter().GetResult());
        break;
}