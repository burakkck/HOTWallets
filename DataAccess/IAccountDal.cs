using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTWallets.DataAccess
{
    public interface IAccountDal
    {
        Account Get(Expression<Func<Account, bool>> filter);
        Account GetAccountById(int id);
        Account GetAccountByCardId(int cardId);
        void Add(Account account);
        void Update(Account account);
        void Delete(Account account);
    }
}
