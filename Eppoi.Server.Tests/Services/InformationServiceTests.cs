using eppoi.Models.Data;
using eppoi.Server.Services;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Eppoi.Server.Tests.Services
{
    [TestFixture]
    public class InformationServiceTests
    {
        private InformationService _sut;
        private ApplicationDBContext dbContext;

        [SetUp]
        public void SetUp()
        {
            DbContextOptionsBuilder<ApplicationDBContext> optionsBuilder = new DbContextOptionsBuilder<ApplicationDBContext>();
            optionsBuilder.UseSqlServer("Data Source=localhost;Database=SPM;Integrated Security=True;Trust Server Certificate=True");

            dbContext = new ApplicationDBContext(optionsBuilder.Options);

            _sut = new InformationService(dbContext);
        }

        [Test]
        public async Task GetCategories_ReturnsCategories()
        {
            // Act
            var result = await _sut.GetCategories();

            // Assert
            Assert.That(result, Is.Not.Null.Or.Empty);
            Assert.That(result.Count(), Is.EqualTo(12));
        }

        [Test]
        public async Task GetPoi_WithWrongId_ReturnsNull()
        {
            // Act
            var result = await _sut.GetPoiDetails("");

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetPoi_WithNullId_ReturnsNull()
        {
            // Act
            var result = await _sut.GetPoiDetails(null!);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetPoi_WithValidId_ReturnsPoi()
        {
            // Act
            var result = await _sut.GetPoiDetails("071c2007-30af-4c1b-800a-66a625877efe");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("Cinema Margherita"));
        }

        [Test]
        public async Task GetBaseInfo_WithInvalidParameters_ReturnsEmpty()
        {
            // Act
            var result = await _sut.GetBaseInfo(0, -1);
            var result2 = await _sut.GetBaseInfo(-1, 0);

            // Assert
            Assert.That(result, Is.Empty);
            Assert.That(result2, Is.Empty);
        }

        [Test]
        public async Task GetBaseInfo_WithValidParameters_ReturnsData()
        {
            // Act
            var result = await _sut.GetBaseInfo(0, 10);

            // Assert
            Assert.That(result, Is.Not.Null.Or.Empty);
            Assert.That(result.Count(), Is.LessThanOrEqualTo(10));
        }

        [TearDown]
        public void ResourceCleanup()
        {
            dbContext?.Dispose();
        }
    }
}
