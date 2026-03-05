using eppoi.Models.Entities;
using eppoi.Server.Options;
using eppoi.Server.Services;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Identity;
using Moq;
using MsOptions = Microsoft.Extensions.Options.Options;

namespace Eppoi.Server.Tests.Services;

[TestFixture]
public class AuthenticationServiceTests
{
    private Mock<UserManager<User>> _userManagerMock;
    private TokenService _tokenService;
    private SmtpService _smtpService;
    private AuthenticationService _sut;

    [SetUp]
    public void SetUp()
    {
        _userManagerMock = new Mock<UserManager<User>>(
            Mock.Of<IUserStore<User>>(), null!, null!, null!, null!, null!, null!, null!, null!
        );

        // TokenService e SmtpService not mockable (non virtual methods),
        // istantiated with fake options for testing purposes
        var tokenOptions = MsOptions.Create(new Eppoi.Server.Options.TokenOption
        {
            Key = "FakeTestKeyAtLeast32Characters!!",
            Issuer = "TestIssuer"
        });
        _tokenService = new TokenService(tokenOptions);

        var smtpOptions = MsOptions.Create(new SmtpOptions
        {
            Host = "localhost",
            Port = 25,
            User = "test",
            Password = "test"
        });
        _smtpService = new SmtpService(smtpOptions);

        _sut = new AuthenticationService(
            _userManagerMock.Object,
            _tokenService,
            _smtpService
        );
    }

    [Test]
    public async Task ValidateUser_WithInvalidUser_ReturnsNull()
    {
        // Arrange
        var login = new eppoi.Server.Models.Authentication.Login { UserOrEmail = "nonexistent", Password = "Test123!" };
        _userManagerMock
            .Setup(x => x.FindByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _sut.ValidateUser(login);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ValidateUser_WithEmail_UsesEmailLookup()
    {
        // Arrange
        var user = new User { UserName = "test", Email = "test@mail.com", Name = "Test" };
        var login = new eppoi.Server.Models.Authentication.Login { UserOrEmail = "test@mail.com", Password = "Test123!" };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync("test@mail.com"))
            .ReturnsAsync(user);
        _userManagerMock
            .Setup(x => x.CheckPasswordAsync(user, login.Password))
            .ReturnsAsync(true);
        _userManagerMock
            .Setup(x => x.IsEmailConfirmedAsync(user))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.ValidateUser(login);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Token, Is.Not.Null.And.Not.Empty);
        _userManagerMock.Verify(x => x.FindByEmailAsync("test@mail.com"), Times.Once);
    }

    [Test]
    public async Task ValidateUser_WithWrongPassword_ReturnsEmptyResponse()
    {
        // Arrange
        var user = new User { UserName = "test", Email = "test@mail.com", Name = "Test" };
        var login = new eppoi.Server.Models.Authentication.Login { UserOrEmail = "test", Password = "wrong" };

        _userManagerMock
            .Setup(x => x.FindByNameAsync("test"))
            .ReturnsAsync(user);
        _userManagerMock
            .Setup(x => x.CheckPasswordAsync(user, "wrong"))
            .ReturnsAsync(false);

        // Act
        var result = await _sut.ValidateUser(login);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Token, Is.Null.Or.Empty);
    }
}