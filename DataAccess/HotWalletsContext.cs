using HOTWallets.Models;
using Microsoft.EntityFrameworkCore;

namespace HOTWallets.DataAccess
{
    public class HotWalletsContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(connectionString:@"Server=(local); Database=HotWallets;Trusted_Connection=true");            
        }

        public DbSet<Card> Card
        {
            get; set;
        }
        public DbSet<Wallet> Wallets
        {
            get; set;
        }
        public DbSet<Trans> Transactions
        {
            get; set;
        }
        public DbSet<Category> Categories
        {
            get; set;
        }
    }
}
