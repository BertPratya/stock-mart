using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Models;

public class AuthorizationHelper
{
    private readonly UserManager<AppUser> _userManager;

    public AuthorizationHelper(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<IActionResult> ValidateTokenAndGetUser(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return new UnauthorizedObjectResult(new { message = "Invalid token" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new UnauthorizedObjectResult(new { message = "User not found" });
            }

            return new OkObjectResult(user);
        }
        catch (Exception)
        {
            return new UnauthorizedObjectResult(new { message = "Invalid token" });
        }
    }
}
