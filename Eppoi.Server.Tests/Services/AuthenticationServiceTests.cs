using eppoi.Models.Entities;
using eppoi.Server.Models.Authentication;
using eppoi.Server.Models.Authentication.Dto;
using eppoi.Server.Services;
using eppoi.Server.Services.Interfaces;
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
    private Mock<ISmtpService> _smtpServiceMock;
    private AuthenticationService _sut;

    [SetUp]
    public void SetUp()
    {
        _userManagerMock = new Mock<UserManager<User>>(
            Mock.Of<IUserStore<User>>(), null!, Mock.Of<IPasswordHasher<User>>(), null!, null!, null!, null!, null!, null!
        );

        _smtpServiceMock = new Mock<ISmtpService>();

        // TokenService not mockable (non virtual methods),
        // Istantiated with fake options for testing purposes
        var tokenOptions = MsOptions.Create(new Options.TokenOption
        {
            Key = "FakeTestKeyAtLeast32Characters!!",
            Issuer = "TestIssuer"
        });
        _tokenService = new TokenService(tokenOptions);

        _sut = new AuthenticationService(
            _userManagerMock.Object,
            _tokenService,
            _smtpServiceMock.Object
        );
    }

    [Test]
    public async Task ValidateUser_WithInvalidUser_ReturnsNull()
    {
        // Arrange
        var login = new Login { UserOrEmail = "nonexistent", Password = "Test123!" };
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
        var login = new Login { UserOrEmail = "test@mail.com", Password = "Test123!" };

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
        var login = new Login { UserOrEmail = "test", Password = "wrong" };

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

    [Test]
    public async Task ValidateUser_WithUnconfirmedPassword_ReturnsEmpty()
    {
        // Arrange
        var user = new User { UserName = "test", Email = "test@mail.com", Name = "Test" };
        var login = new Login { UserOrEmail = "test", Password = "Test123" };

        _userManagerMock
            .Setup(x => x.FindByNameAsync("test"))
            .ReturnsAsync(user);
        _userManagerMock
            .Setup(x => x.CheckPasswordAsync(user, login.Password))
            .ReturnsAsync(true);
        _userManagerMock
            .Setup(x => x.IsEmailConfirmedAsync(user))
            .ReturnsAsync(false);

        // Act
        var result = await _sut.ValidateUser(login);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result!.Token, Is.Null.Or.Empty);
            Assert.That(result.Preferences, Is.Not.Null);
        });
    }

    [Test]
    public async Task CreateUser_ReturnsTrue()
    {
        // Arrange
        var userDto = new UserDto
        {
            UserName = "test",
            Email = "test@mail.com",
            Name = "Test",
            Password = "Test123!",
            Preferences = [Preferences.P_Article]
        };
        _userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);
        _smtpServiceMock
            .Setup(x => x.SendMail(It.IsAny<Email>()))
            .Verifiable();

        // Act
        var result = await _sut.CreateUser(userDto);

        // Assert
        Assert.That(result.Succeeded, Is.True);
        _smtpServiceMock.Verify(x => x.SendMail(It.IsAny<Email>()), Times.Once);
    }

    [Test]
    public async Task CreateUser_WithEmptyPreferences_ReturnsFalse()
    {
        // Arrange
        var userDto = new UserDto
        {
            UserName = "test",
            Email = "test@mail.com",
            Name = "Test",
            Password = "Test123!",
            Preferences = []
        };

        _userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _sut.CreateUser(userDto);

        // Assert
        Assert.That(result.Succeeded, Is.False);
        _smtpServiceMock.Verify(x => x.SendMail(It.IsAny<Email>()), Times.Never);
    }

    [Test]
    public async Task PasswordReset_WithCorrectEmail_ReturnsTrue()
    {
        // Arrange
        var user = new User { UserName = "test", Email = "test@mail.com", Name = "Test" };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync("test@mail.com"))
            .ReturnsAsync(user);
        _userManagerMock
            .Setup(x => x.GeneratePasswordResetTokenAsync(user))
            .ReturnsAsync("TestResetToken");
        _smtpServiceMock
            .Setup(x => x.SendMail(It.IsAny<Email>()))
            .Verifiable();


        // Act
        var result = await _sut.SendPasswordResetEmail("test@mail.com");

        // Assert
        Assert.That(result, Is.EqualTo("TestResetToken"));
        _smtpServiceMock.Verify(x => x.SendMail(It.IsAny<Email>()), Times.Once);
    }

}    