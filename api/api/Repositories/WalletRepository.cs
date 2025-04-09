using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class WalletRepository : IWalletService
    {
        private readonly ApplicationDBContext _context;

        public WalletRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Wallet>> GetAllWallets()
        {
            return await _context.Wallets.ToListAsync();
        }

        public async Task<Wallet> GetWalletByWalletId(string walletId)
        {
            return await _context.Wallets.FirstOrDefaultAsync(w => w.WalletId == walletId);
        }

        public async Task<Wallet> GetWallet(int id)
        {
            return await _context.Wallets.FindAsync(id);
        }

        public async Task<Wallet> CreateWallet(string userId, AppUser user)
        {
            var wallet = new Wallet
            {
                WalletId = Guid.NewGuid().ToString(),
                UserId = userId,
                Balance = 0,
                CreatedOn = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow,
                Currency = "USD", 
                Status = WalletStatus.Active,
                AppUser = user
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            return wallet;
        }

        public async Task<Wallet> Deposit(string walletId, decimal amount)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.WalletId == walletId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found.");
            }

            wallet.Balance += amount;
            wallet.LastUpdate = DateTime.UtcNow;

            _context.Wallets.Update(wallet);
            await _context.SaveChangesAsync();

            return wallet;
        }

        public async Task<Wallet> Withdraw(string walletId, decimal amount)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.WalletId == walletId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found.");
            }

            if (wallet.Balance < amount)
            {
                throw new Exception("Insufficient balance.");
            }

            wallet.Balance -= amount;
            wallet.LastUpdate = DateTime.UtcNow;

            _context.Wallets.Update(wallet);
            await _context.SaveChangesAsync();

            return wallet;
        }

        public async Task<Wallet> UpdateStatus(string walletId, string status)
        {
            if (!Enum.TryParse<WalletStatus>(status, true, out var newStatus))
            {
                throw new ArgumentException("Invalid wallet status.");
            }

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.WalletId == walletId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found.");
            }

            wallet.Status = newStatus;
            wallet.LastUpdate = DateTime.UtcNow;

            _context.Wallets.Update(wallet);
            await _context.SaveChangesAsync();

            return wallet;
        }

        public async Task<Wallet> GetUserWalletByUserId(string userId)
        {
            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
            if (wallet == null)
            {
                throw new Exception("Wallet not found.");
            }

            return wallet;
        }
    }
}
