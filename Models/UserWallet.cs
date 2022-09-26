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
        public Card Card
        {
            get; set;
        }
        public Wallet Wallet
        {
            get; set;
        }

    }
}
