namespace HOTWallets.Models
{
    public class Wallet
    {
        public int Id
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }
        public float Balance
        {
            get; set;
        }
        public List<Card> Cards
        {
            get; set;
        }
    }
}
