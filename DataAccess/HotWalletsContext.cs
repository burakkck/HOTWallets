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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CardWallet>()
                .HasKey(cw => new { cw.CardId, cw.WalletId });
            modelBuilder.Entity<CardWallet>()
                .HasOne(cw => cw.Card)
                .WithMany(c => c.CardWallets)
                .HasForeignKey(cw => cw.CardId);
            modelBuilder.Entity<CardWallet>()
                .HasOne(cw => cw.Wallet)
                .WithMany(w => w.CardWallets)
                .HasForeignKey(cw => cw.WalletId);
        }

        public DbSet<Card> Card
        {
            get; set;
        }
        public DbSet<Wallet> Wallet
        {
            get; set;
        }
        public DbSet<Trans> Trans
        {
            get; set;
        }
        public DbSet<Category> Category
        {
            get; set;
        }
        public DbSet<CardWallet> CardsWallets
        {
            get; set;
        }
    }
}
