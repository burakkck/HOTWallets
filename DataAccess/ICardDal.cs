using System.Linq.Expressions;
using HOTWallets.Models;

namespace HOTWallets.DataAccess
{
    public interface ICardDal
    {
        Card Get(Expression<Func<Card, bool>> filter);
        List<Card> GetAll(Expression<Func<Card, bool>> filter = null);
        Card GetById(int id);
        bool CardCheck(Expression<Func<Card, bool>> filter, out Card value);
        List<Card> GetCardsByWalletId(int walletId);
        void Add(Card card);
        void Update(Card card);
        void Delete(Card card);
    }
}
