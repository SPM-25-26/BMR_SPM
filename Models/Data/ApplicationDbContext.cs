using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using eppoi.Models.Entities;
using eppoi.Models.Entities.Import;
using eppoi.Models.Entities.Import.ArtNatures;
using eppoi.Models.Entities.Import.Articles;
using eppoi.Models.Entities.Import.Restaurants;
using eppoi.Models.Entities.Import.Events;
using eppoi.Models.Entities.Import.Routes;
using eppoi.Models.Entities.Import.Organizations;

namespace eppoi.Models.Data
{
    public class ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : IdentityDbContext<User>(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(u =>
            {
                u.HasOne(us => us.Preferences)
                    .WithOne(p => p.User);
            });

            builder.Entity<Preferences>(p =>
            {
                p.ToTable("Preferences");
                p.HasKey(p => p.UserId);
            });

            builder.Entity<ArtNature>(ac =>
            {
                ac.ToTable("ArtNatures");
                ac.HasMany(a => a.Catalogues)
                    .WithOne(c => c.ArtNature)
                    .HasForeignKey(c => c.ArtNatureId)
                    .OnDelete(DeleteBehavior.Cascade);

                ac.HasMany(a => a.CreativeWorks)
                    .WithOne(cw => cw.ArtNature)
                    .HasForeignKey(cw => cw.ArtNatureId)
                    .OnDelete(DeleteBehavior.Cascade);

                ac.HasOne(a => a.Site)
                    .WithMany();

            });

            builder.Entity<Catalogue>(ct =>
            {
                ct.ToTable("Catalogues");
                ct.HasKey(c => c.Id);
                ct.Property(c => c.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<CreativeWork>(cw =>
            {
                cw.ToTable("CreativeWorks");
                cw.HasKey(c => c.Id);
                cw.Property(c => c.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Article>(a =>
            {
                a.ToTable("Articles");
                a.HasKey(ar => ar.Id);
                a.HasMany(ar => ar.Paragraphs)
                    .WithOne(c => c.Article)
                    .HasForeignKey(c => c.ArticleId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Paragraph>(p =>
            {
                p.ToTable("Paragraphs");
                p.HasKey(par => par.Id);
                p.Property(par => par.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Category>(cat =>
            {
                cat.ToTable("Categories");
                cat.HasKey(c => c.Id);
                cat.Property(c => c.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Restaurant>(r =>
            {
                r.ToTable("Restaurants");
                r.HasKey(res => res.Id);

                r.HasOne(res => res.Owner)
                    .WithMany(o => o.Restaurants)
                    .HasForeignKey(res => res.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);

                r.HasOne(res => res.OpeningHours)
                    .WithMany(oh => oh.Restaurants)
                    .HasForeignKey(res => res.OpeningHoursId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Owner>(o =>
            {
                o.ToTable("Owners");
                o.HasKey(ow => ow.TaxCode);
            });

            builder.Entity<OpeningHours>(oh =>
            {
                oh.ToTable("OpeningHours");
                oh.HasKey(oh => oh.Id);
                oh.Property(oh => oh.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Entertainment>(e =>
            {
                e.ToTable("Entertainments");
                e.HasKey(ent => ent.Id);
            });

            builder.Entity<Event>(e =>
            {
                e.ToTable("Events");
                e.HasKey(ev => ev.Id);
                
                e.HasOne(ev => ev.Organizer)
                    .WithMany(o => o.Events)
                    .HasForeignKey(ev => ev.OrganizerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Organizer>(o =>
            {
                o.ToTable("Organizers");
                o.HasKey(org => org.Id);
                o.Property(org => org.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Route>(r =>
            {
                r.ToTable("Routes");
                r.HasKey(ro => ro.Id);

                r.HasOne(ro => ro.StartingPoint)
                    .WithMany(s => s.Routes)
                    .HasForeignKey(ro => ro.StartingPointId)
                    .OnDelete(DeleteBehavior.Cascade);

                r.HasMany(ro => ro.Stages)
                    .WithOne(s => s.Route)
                    .HasForeignKey(s => s.RouteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<StartingPoint>(sp =>
            {
                sp.ToTable("StartingPoints");
                sp.HasKey(s => s.Id);
                sp.Property(s => s.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Stage>(s =>
            {
                s.ToTable("Stages");
                s.HasKey(st => st.Id);
                s.Property(st => st.Id)
                    .ValueGeneratedOnAdd();
            });

            builder.Entity<Shopping>(sh =>
            {
                sh.ToTable("Shoppings");
                sh.HasKey(s => s.Id);
                sh.HasOne(s => s.Owner)
                    .WithMany(o => o.Shoppings)
                    .HasForeignKey(s => s.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Sleep>(sl =>
            {
                sl.ToTable("Sleeps");
                sl.HasKey(s => s.Id);
                sl.HasOne(s => s.Owner)
                    .WithMany(o => o.Sleeps)
                    .HasForeignKey(s => s.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Organization>(org =>
            {
                org.ToTable("Organizations");
                org.HasKey(o => o.Id);

                org.HasMany(o => o.OwnedPois)
                    .WithOne(op => op.Organization)
                    .HasForeignKey(op => op.OrganizationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        public DbSet<ArtNature> ArtNatures { get; set; } = null!;
        public DbSet<Article> Articles { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;    
        public DbSet<Restaurant> Restaurants { get; set; } = null!;
        public DbSet<Owner> Owners { get; set; } = null!;
        public DbSet<OpeningHours> OpeningHours { get; set; } = null!;
        public DbSet<Entertainment> Entertainments { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<Organizer> Organizers { get; set; } = null!;
        public DbSet<Route> Routes { get; set; } = null!;
        public DbSet<StartingPoint> StartingPoints { get; set; } = null!;
        public DbSet<Shopping> Shoppings { get; set; } = null!;
        public DbSet<Sleep> Sleeps { get; set; } = null!;
        public DbSet<Organization> Organizations { get; set; } = null!;
        public DbSet<Preferences> Preferences { get; set; } = null!;
    }
}
