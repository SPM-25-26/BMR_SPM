using eppoi.Models.Entities;
using eppoi.Server.Models.Authentication;
using eppoi.Server.Services;
using eppoi.Server.Services.Interfaces;
using Eppoi.Server.Services;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace Eppoi.Server.Tests.Services;

public class OptionsServiceTests
{

    private Mock<UserManager<User>> _userManagerMock;
    private OptionsService _sut;

    [SetUp]
    public void Setup()
    {
        _userManagerMock = new Mock<UserManager<User>>(
            Mock.Of<IUserStore<User>>(), null!, null!, null!, null!, null!, null!, null!, null!
        );

        _sut = new OptionsService(_userManagerMock.Object);
    }

    [Test]
    public async Task ChangePreferences_WithInvalidUser_ReturnsFailed()
    {
        // Arrange
        var user = new User { UserName = "nonexixtent", Email = "test@mail.com", Name = "Test", Preferences = Preferences.P_Event };
        _userManagerMock
            .Setup(x => x.FindByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _sut.ChangePreferences([user.Preferences], user.Name);

        // Assert
        Assert.That(result.Succeeded, Is.False);
    }

    [Test]
    public async Task ChangePreferences_ValidUser_ReturnsSuccess()
    {
        // Arrange
        var user = new User { UserName = "test", Email = "test@mail.com", Name = "Test", Preferences = Preferences.P_Event };
        _userManagerMock
            .Setup(x => x.FindByNameAsync("Test"))
            .ReturnsAsync(user);
        _userManagerMock
            .Setup(x => x.UpdateAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _sut.ChangePreferences([user.Preferences], user.Name);

        // Assert
        Assert.That(result.Succeeded, Is.True);
    }

}
