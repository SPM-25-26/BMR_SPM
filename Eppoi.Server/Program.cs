using eppoi.Server.Models.Factories;
using eppoi.Server.Services;
using Eppoi.Server.Data;
using Eppoi.Server.Models;
using Eppoi.Server.Options;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo()
    {
        Title = "Eppoi",
        Version = "v1"
    });
    // definizione della sicurezza
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\""
    });
    // Per tutte le api.
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme()
                        {
                            Reference = new OpenApiReference()
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
});

builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Developer exception page for EF migrations
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddIdentityCore<User>(options =>
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
}).AddEntityFrameworkStores<ApplicationDBContext>();

var jwtAuthOpt = new TokenOption();
builder.Configuration.GetSection("JwtAuthentication")
    .Bind(jwtAuthOpt);

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        string key = jwtAuthOpt.Key;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true, 
            ValidateLifetime = true, 
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtAuthOpt.Issuer,
            IssuerSigningKey = securityKey
        };
    });
builder.Services.Configure<TokenOption>(builder.Configuration.GetSection("JwtAuthentication"));
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<AuthenticationService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        context.Response.ContentType = "application/json";
        var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (contextFeature != null)
        {
            var res = ResponseFactory
                .WithError(contextFeature.Error);
            await context.Response.WriteAsJsonAsync(
                res
                );
        }
    });
});

app.Run();
