namespace HOTWallets.Models
{
    public class Trans
    {
        public int Id
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }

        public decimal? Price
        {
            get; set;
        }
        public string Type
        {
            get; set;
        }
        public int CardId
        {
            get; set;
        }
        public int WalletId
        {
            get; set;
        }
        public int CategoryId
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
        public Category Category
        {
            get; set;
        }


    }
}
