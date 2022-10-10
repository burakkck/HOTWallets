using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace HOTWallets.Models
{
    public class Card
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
        } = "admin";
        public virtual ICollection<CardWallet> CardWallets
        {
            get; set;
        } = new List<CardWallet>();
        public int AccountId
        {
            get; set;
        }
        public Account Account
        {
            get; set;
        }

        //public virtual ICollection<Wallet> Wallets
        //{
        //    get; set;
        //}
    }

}
