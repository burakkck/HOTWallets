namespace HOTWallets.Models
{
    public class CardWallet
    {
        public int CardId
        {
            get; set;
        }
        public int WalletId
        {
            get; set;
        }
        public virtual Card Card
        {
            get; set;
        }
        public virtual Wallet Wallet
        {
            get; set;
        }

    }
}
