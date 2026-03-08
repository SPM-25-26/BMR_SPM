using eppoi.Models.Entities.Import;
using eppoi.Models.Entities.Import.ArtNatures;
using eppoi.Models.Entities.Import.Articles;
using eppoi.Models.Entities.Import.Events;
using eppoi.Models.Entities.Import.Organizations;
using eppoi.Models.Entities.Import.Restaurants;
using eppoi.Models.Entities.Import.Routes;
using eppoi.Server.Services;
using eppoi.Server.Services.Interfaces;
using Moq;

namespace Eppoi.Server.Tests.Services
{
    [TestFixture]
    public class InformationServiceTests
    {
        private InformationService _sut = null!;
        private Mock<IInformationReadStore> _readStoreMock = null!;

        [SetUp]
        public void SetUp()
        {
            _readStoreMock = new Mock<IInformationReadStore>(MockBehavior.Strict);
            SetupBaseInfoSourcesEmpty();

            _sut = new InformationService(_readStoreMock.Object);
        }

        [Test]
        public async Task GetCategories_ReturnsCategories()
        {
            _readStoreMock
                .Setup(x => x.GetCategoriesAsync())
                .ReturnsAsync(
                [
                    new Category { Name = "Cat 1", ImagePath = "/img/1.png", Label = "L1" },
                    new Category { Name = "Cat 2", ImagePath = "/img/2.png", Label = "L2" }
                ]);

            var result = await _sut.GetCategories();

            Assert.That(result, Is.Not.Null.Or.Empty);
            Assert.That(result.Count(), Is.EqualTo(2));
        }

        [Test]
        public async Task GetPoi_WithWrongId_ReturnsNull()
        {
            _readStoreMock
                .Setup(x => x.FindArtNatureByIdAsync(string.Empty))
                .ReturnsAsync((ArtNature?)null);

            var result = await _sut.GetPoiDetails(string.Empty);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetPoi_WithNullId_ReturnsNull()
        {
            _readStoreMock
                .Setup(x => x.FindArtNatureByIdAsync(null!))
                .ReturnsAsync((ArtNature?)null);

            var result = await _sut.GetPoiDetails(null!);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetPoi_WithValidId_ReturnsPoi()
        {
            _readStoreMock
                .Setup(x => x.FindArtNatureByIdAsync("poi-1"))
                .ReturnsAsync(new ArtNature
                {
                    Id = "poi-1",
                    Name = "Cinema Margherita",
                    ImagePath = "/img/cinema.png",
                    Type = "Cinema",
                    Description = "Desc",
                    Category = "Culture",
                    Address = "Via Roma",
                    Latitude = 41.9f,
                    Longitude = 12.5f
                });

            var result = await _sut.GetPoiDetails("poi-1");

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Name, Is.EqualTo("Cinema Margherita"));
        }

        [Test]
        public async Task GetBaseInfo_WithInvalidParameters_ReturnsEmpty()
        {
            var result = await _sut.GetBaseInfo(0, -1);
            var result2 = await _sut.GetBaseInfo(-1, 0);

            Assert.That(result, Is.Empty);
            Assert.That(result2, Is.Empty);

            _readStoreMock.Verify(x => x.GetArtNaturesAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetEventsAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetArticlesAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetEntertainmentsAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetOrganizationsAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetRestaurantsAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetRoutesAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetShoppingsAsync(), Times.Never);
            _readStoreMock.Verify(x => x.GetSleepsAsync(), Times.Never);
        }

        [Test]
        public async Task GetBaseInfo_WithValidParameters_ReturnsData()
        {
            _readStoreMock.Setup(x => x.GetArtNaturesAsync()).ReturnsAsync(
            [
                new ArtNature
                {
                    Id = "a1",
                    Name = "Art",
                    ImagePath = "/img/a.png",
                    Type = "Poi",
                    Address = "Addr",
                    Category = "Culture",
                    Latitude = 1,
                    Longitude = 1
                }
            ]);

            _readStoreMock.Setup(x => x.GetEventsAsync()).ReturnsAsync(
            [
                new Event
                {
                    Id = "e1",
                    Description = "Event desc",
                    ImagePath = "/img/e.png",
                    Type = "Event",
                    Address = "Addr",
                    Audience = "All",
                    Latitude = 2,
                    Longitude = 2
                }
            ]);

            _readStoreMock.Setup(x => x.GetArticlesAsync()).ReturnsAsync(
            [
                new Article
                {
                    Id = "ar1",
                    Name = "Article",
                    ImagePath = "/img/ar.png",
                    TimeToRead = "5m"
                }
            ]);

            var result = await _sut.GetBaseInfo(0, 10);

            Assert.That(result, Is.Not.Null.Or.Empty);
            Assert.That(result.Count(), Is.LessThanOrEqualTo(10));
        }

        private void SetupBaseInfoSourcesEmpty()
        {
            _readStoreMock.Setup(x => x.GetArtNaturesAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetEventsAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetArticlesAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetEntertainmentsAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetOrganizationsAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetRestaurantsAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetRoutesAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetShoppingsAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetSleepsAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.GetCategoriesAsync()).ReturnsAsync([]);
            _readStoreMock.Setup(x => x.FindArtNatureByIdAsync(It.IsAny<string>())).ReturnsAsync((ArtNature?)null);
        }
    }
}
