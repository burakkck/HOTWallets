namespace HOTWallets.Models
{
    public class Category
    {
        public int Id
        {
            get; set;
        }
        public string Name
        {
            get; set;
        }
        public string Icon
        {
            get; set;
        }
        public int Type
        {
            get; set;
        }
        public int AccountId
        {
            get; set;
        }
        public List<Trans> Transactions
        {
            get; set;
        }
    }
}
