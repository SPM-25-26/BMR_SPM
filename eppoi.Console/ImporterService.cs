using eppoi.Models.Data;
using eppoi.Models.Importer;
using eppoi.Models.Entities.Import.ArtNatures;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using eppoi.Models.Entities.Import.Routes;
using eppoi.Models.Entities.Import;
using eppoi.Models.Entities.Import.Articles;
using eppoi.Models.Entities.Import.Restaurants;
using eppoi.Models.Entities.Import.Events;
using eppoi.Models.Entities.Import.Organizations;

namespace eppoi.Console
{
    public class ImporterService(ApplicationDBContext db, Link link)
    {
        public void Import()
        {
            // CATEGORIES
            var categories = Get<IEnumerable<CategoryImport>>(link.Categories).ToHashSet();
            db.Categories.ExecuteDelete();
            db.Categories.AddRange(categories.Select(c => new Category(c)));



            // ART CULTURES AND NATURES
            var artCultures = Get<IEnumerable<Default>>(link.ArtCultureList)
                .Select(x => Get<ArtNatureImport>(string.Format(link.ArtCultureDetails, x.entityId)))
                .ToHashSet();
            var natures = Get<IEnumerable<Default>>(link.NatureList)
                .Select(x => Get<ArtNatureImport>(string.Format(link.NatureDetails, x.entityId)))
                .ToHashSet();

            var sites = artCultures
                .Where(ac => ac.site != null)
                .ToDictionary(ac => ac.identifier, ac => ac.site!);

            var artCultureEnt = artCultures.Select(ac => new ArtNature(ac, "ArtCulture")).ToList();
            artCultureEnt = [.. artCultureEnt.Select(ac =>
            {
                ac.Site = sites.TryGetValue(ac.Id, out Site value)
                    ? artCultureEnt.FirstOrDefault(a => a.Id == value.identifier)
                    : null;
                return ac;
            })];

            sites = natures
                .Where(n => n.site != null)
                .ToDictionary(n => n.identifier, n => n.site!);

            var natureEnt = natures.Select(n => new ArtNature(n, "Nature")).ToList();
            natureEnt = [.. natureEnt.Select(n =>
            {
                n.Site = sites.TryGetValue(n.Id, out Site value)
                    ? artCultureEnt.FirstOrDefault(a => a.Id == value.identifier)
                    : null;
                return n;
            })];

            db.ArtNatures.ExecuteDelete();
            db.ArtNatures.AddRange(artCultureEnt);
            db.ArtNatures.AddRange(natureEnt);



            // ARTICLES
            var articles = Get<IEnumerable<Default>>(link.ArticleList)
               .Select(x => Get<ArticleImport>(string.Format(link.ArticleDetails, x.entityId)))
               .ToHashSet();
            db.Articles.ExecuteDelete();
            db.Articles.AddRange(articles.Select(a => new Article(a)));



            // RESTAURANTS
            var restaurants = Get<IEnumerable<Default>>(link.RestaurantList)
               .Select(x => Get<RestaurantImport>(string.Format(link.RestaurantDetails, x.entityId)))
               .ToHashSet();

            var ownerCache = new Dictionary<string, Models.Entities.Import.Owner>();
            var openingHoursCache = new Dictionary<string, OpeningHours>
            {
                [""] = new OpeningHours()
            };

            var restaurantEnt = restaurants.Select(r =>
            {
                var owner = ownerCache.TryGetValue(r.owner.taxCode, out var o) ? o
                : ownerCache[r.owner.taxCode] = new Models.Entities.Import.Owner(r.owner);

                OpeningHours openingHour;
                if (r.openingHours is not null)
                {
                    openingHour = openingHoursCache.TryGetValue(r.openingHours.opens + r.openingHours.closes + r.openingHours.description + r.openingHours.admissionType, out var oh)
                    ? oh : openingHoursCache[r.openingHours.opens + r.openingHours.closes + r.openingHours.description + r.openingHours.admissionType] = new OpeningHours(r.openingHours);
                }
                else { openingHour = openingHoursCache[""]; }

                var rest = new Restaurant(r)
                {
                    OwnerId = owner.TaxCode,
                    Owner = owner,
                    OpeningHoursId = openingHour.Id,
                    OpeningHours = openingHour
                };

                owner.Restaurants = [.. owner.Restaurants, rest];
                openingHour.Restaurants = [.. openingHour.Restaurants, rest];

                return rest;
            }).ToList();

            db.Owners.ExecuteDelete();
            db.OpeningHours.ExecuteDelete();
            db.Restaurants.AddRange(restaurantEnt);



            // ENTERTAINMENTS
            var entertainments = Get<IEnumerable<Default>>(link.EntertainmentList)
               .Select(x => Get<EntertainmentImport>(string.Format(link.EntertainmentDetails, x.entityId)))
               .ToHashSet();
            db.Entertainments.ExecuteDelete();
            db.Entertainments.AddRange(entertainments.Select(e => new Entertainment(e)));



            // EVENTS
            var events = Get<IEnumerable<Default>>(link.EventList)
               .Select(x => Get<EventImport>(string.Format(link.EventDetails, x.entityId)))
               .ToHashSet();

            var organizerCache = new Dictionary<string, Models.Entities.Import.Events.Organizer>
            {
                [""] = new Models.Entities.Import.Events.Organizer()
            };

            var eventEnt = events.Select(e =>
            {
                Models.Entities.Import.Events.Organizer organizer;
                if (e.organizer != null && e.organizer.taxCode != null)
                {
                    organizer = organizerCache.TryGetValue(e.organizer.taxCode, out var o) ? o
                    : organizerCache[e.organizer.taxCode] = new Models.Entities.Import.Events.Organizer
                    {
                        Name = e.organizer.legalName,
                        TaxCode = e.organizer.taxCode,
                        Website = e.organizer.website
                    };
                }
                else { organizer = organizerCache[""]; }

                var ev = new Event(e)
                {
                    OrganizerId = organizer.Id,
                    Organizer = organizer
                };

                organizer.Events = [.. organizer.Events, ev];
                return ev;
            }).ToList();

            db.Organizers.ExecuteDelete();
            db.Events.AddRange(eventEnt);



            // ROUTES
            var routes = Get<IEnumerable<Default>>(link.RouteList)
                .Select(x => Get<RouteImport>(string.Format(link.RouteDetails, x.entityId)))
                .ToHashSet();
            var startingPointCache = new Dictionary<string, StartingPoint>
            {
                [""] = new StartingPoint()
            };

            var routeEnt = routes.Select(r =>
            {
                StartingPoint startingPoint;
                if (r.startingPoint != null && r.startingPoint.address != null)
                {
                    startingPoint = startingPointCache.TryGetValue(r.startingPoint.address, out var sp) ? sp
                    : startingPointCache[r.startingPoint.address] = new StartingPoint
                    {
                        Latitude = r.startingPoint.latitude,
                        Longitude = r.startingPoint.longitude,
                        Address = r.startingPoint.address
                    };
                }
                else { startingPoint = startingPointCache[""]; }

                var route = new Route(r)
                {
                    StartingPointId = startingPoint.Id,
                    StartingPoint = startingPoint
                };
                startingPoint.Routes = [.. startingPoint.Routes, route];
                return route;
            }).ToList();

            db.StartingPoints.ExecuteDelete();
            db.Routes.ExecuteDelete();
            db.Routes.AddRange(routeEnt);



            // SHOPPING
            var shoppings = Get<IEnumerable<Default>>(link.ShoppingList)
               .Select(x => Get<ShoppingImport>(string.Format(link.ShoppingDetails, x.entityId)))
               .ToHashSet();

            var shoppingEnt = shoppings.Select(s =>
            {
                var owner = ownerCache.TryGetValue(s.owner.taxCode, out var o) ? o
                : ownerCache[s.owner.taxCode] = new Models.Entities.Import.Owner(s.owner);
                var shop = new Shopping(s)
                {
                    OwnerId = owner.TaxCode,
                    Owner = owner
                };
                owner.Shoppings = [.. owner.Shoppings, shop];
                return shop;
            }).ToList();
            db.Shoppings.AddRange(shoppingEnt);



            // SLEEPS
            var sleeps = Get<IEnumerable<Default>>(link.SleepList)
               .Select(x => Get<SleepImport>(string.Format(link.SleepDetails, x.entityId)))
               .ToHashSet();

            var sleepent = sleeps.Select(s =>
            {
                var owner = ownerCache.TryGetValue(s.owner.taxCode, out var o) ? o
                : ownerCache[s.owner.taxCode] = new Models.Entities.Import.Owner(s.owner);
                var sleep = new Sleep(s)
                {
                    OwnerId = owner.TaxCode,
                    Owner = owner
                };
                owner.Sleeps = [.. owner.Sleeps, sleep];
                return sleep;
            }).ToList();
            db.Sleeps.AddRange(sleepent);



            // ORGANIZATIONS
            var organizations = Get<IEnumerable<Default>>(link.OrganizationList)
               .Select(x => Get<OrganizationImport>(string.Format(link.OrganizationDetails, x.entityId)))
               .ToHashSet();
            db.Organizations.ExecuteDelete();
            db.Organizations.AddRange(organizations.Select(o => new Organization(o)));



            db.SaveChanges();
        }


        private static T Get<T>(string url)
        {
            using var client = new HttpClient();
            var response = client.GetAsync(url).Result;
            response.EnsureSuccessStatusCode();
            var responseBody = response.Content.ReadAsStringAsync().Result;
            return System.Text.Json.JsonSerializer.Deserialize<T>(responseBody)!;
        }


        private static bool IsNullOrEmpty(object value)
        {
            if (value == null)
                return true;

            if (value is string s)
                return string.IsNullOrWhiteSpace(s);

            if (value is System.Collections.IEnumerable enumerable && value is not string)
                return !enumerable.Cast<object>().Any();

            return false;
        }

        private static void CountNulls<T>(IEnumerable<T> items)
        {
            var type = typeof(T);
            var properties = type.GetProperties();

            var nullCountByProperty = new Dictionary<string, int>();

            foreach (var prop in properties)
            {
                nullCountByProperty[prop.Name] = items.Count(item => IsNullOrEmpty(prop.GetValue(item)));
            }

            return;
        }
    }
}
