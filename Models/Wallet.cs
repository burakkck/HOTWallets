using System.ComponentModel.DataAnnotations;

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
        
        public decimal Balance
        {
            get; set;
        }
        public ICollection<CardWallet> CardWallets
        {
            get; set;
        } 
        //public virtual ICollection<Card> Cards
        //{
        //    get; set;
        //}

        public ICollection<Trans> Transactions
        {
            get; set;
        }
    }
}
