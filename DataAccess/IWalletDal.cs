using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTWallets.DataAccess
{
    public interface IWalletDal
    {
        Wallet Get(Expression<Func<Wallet, bool>> filter);
        Wallet GetById(int id);
        List<Wallet> GetAll(Expression<Func<Wallet, bool>> filter = null);
        Wallet LastData();
        Wallet WalletById(int id);
        List<Wallet> GetWalletsByCardId(int cardId);
        Wallet Add(Wallet wallet);
        void Update(Wallet wallet);
        void Delete(Wallet wallet);
    }
}
