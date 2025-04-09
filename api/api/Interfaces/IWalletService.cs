using api.Models;

namespace api.Interfaces
{
    public interface IWalletService
    {
        Task<List<Wallet>> GetAllWallets();
        Task<Wallet> GetUserWalletByUserId(string id);
        Task<Wallet> GetWallet(int id);
        Task<Wallet> CreateWallet(string id, AppUser user);
        Task<Wallet> Deposit(string id, decimal amount);
        Task<Wallet> Withdraw(string id, decimal amount);

        Task<Wallet> UpdateStatus(string id, string status);

        Task<Wallet> GetWalletByWalletId(string walletId);

    }
}
