namespace HOTWallets.Models
{
    public class Transaction
    {
        public int Id
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }
        public float Price
        {
            get; set;
        }
        public int Type
        {
            get; set;
        }
        public User User
        {
            get; set;
        }

    }
}
