namespace HOTWallets.Models
{
    public class Account
    {
        public int Id
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }
        public List<Category> Categories
        {
            get; set;
        }
        public List<Card> Cards
        {
            get; set;
        }
    }
}
