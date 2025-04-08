using api.Models;

namespace api.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(AppUser user);
    }
}
