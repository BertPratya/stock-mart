using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace api.Data
{
    public class ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : IdentityDbContext<AppUser>(options)
    {
        public DbSet<StockModel> StockModels { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<StockQuote> StockQuotes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseLoggerFactory(LoggerFactory.Create(builder => { builder.AddConsole(); }))
                .EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); 

            builder.Entity<Wallet>()
                .HasOne(w => w.AppUser)
                .WithOne(u => u.Wallet)
                .HasForeignKey<Wallet>(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Transaction>()
            .HasOne(t => t.AppUser) 
            .WithMany(u => u.Transactions) 
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade); 
            
            builder.Entity<Transaction>()
                .HasOne(t => t.StockModel)
                .WithOne()
                .HasForeignKey<Transaction>(t => t.StockId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<StockQuote>()
                .HasOne(t => t.StockModel)
                .WithOne(t => t.StockQuote)
                .HasForeignKey<StockQuote>(t => t.StockId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<StockModel>()
                .HasOne(t => t.StockQuote)
                .WithOne(t => t.StockModel)
                .HasForeignKey<StockModel>(t => t.StockQuoteId);
        }
    }
}
