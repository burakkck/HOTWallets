using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTWallets.DataAccess
{
    public interface IWalletDal
    {
        Wallet Get(Expression<Func<Wallet, bool>> filter);
        Wallet WalletById(int id);
        IList<Wallet> GetWalletsByCardId(Expression<Func<Wallet, bool>> filter = null);
        void Add(Wallet Wallet);
        void Update(Wallet Wallet);
        void Delete(Wallet Wallet);
    }
}
