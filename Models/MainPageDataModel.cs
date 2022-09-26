namespace HOTWallets.Models
{
    public class MainPageDataModel
    {
        public int Id
        {
            get; set;
        }
        public string Username
        {
            get; set;
        }
        public string FirstName
        {
            get; set;
        }
        public string LastName
        {
            get; set;
        }
        public string Email
        {
            get; set;
        }
        public List<Wallet> Wallets
        {
            get; set;
        } = new List<Wallet>();


    }
}
