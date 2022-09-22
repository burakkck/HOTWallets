using Microsoft.AspNetCore.Mvc;

namespace HOTWallets.Models
{
    public class User
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
        public string Password
        {
            get; set;
        }
        public string Role
        {
            get; set;
        }
        public List<Wallet> Wallets
        {
            get; set;
        }
        public List<Transaction> Transactions
        {
            get; set;
        }
    }

    public class Users : List<User>
    {
        private Users()
        {
        }
        private static Users _Instance = null;
        public static Users Instance
        {
            get
            {
                if (_Instance == null)
                {
                    _Instance = new Users();
                    Instance.Add(new User { FirstName = "Burak", LastName = "Küçük", Id = 1, Email = "burakkucuk@gmail.com", Username = "burakkucuk", Password = "1234567" });
                }
                return _Instance;
            }
        }
    }

}
