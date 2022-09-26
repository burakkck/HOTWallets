using System.Linq;
using System.Linq.Expressions;
using HOTWallets.Models;
using Microsoft.EntityFrameworkCore;

namespace HOTWallets.DataAccess
{
    public class WalletDal : IWalletDal
    {
        public void Add(Wallet wallet)
        {
            using (var context = new HotWalletsContext())
            {
                context.Wallet.Add(wallet);
                context.SaveChanges();
            }
        }

        public void Delete(Wallet wallet)
        {
            using (var context = new HotWalletsContext())
            {
                context.Wallet.Remove(wallet);
                context.SaveChanges();
            }
        }

        public Wallet Get(Expression<Func<Wallet, bool>> filter)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Wallet.FirstOrDefault(filter);
            }
        }

        public List<Wallet> GetAll(Expression<Func<Wallet, bool>> filter = null)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Wallet.ToList();
            }
        }

        public Wallet GetById(int id)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Wallet.Where(x => x.Id == id).FirstOrDefault();
            }
        }

        public List<Wallet> GetWalletsByCardId(int cardId)
        {
            using (var context = new HotWalletsContext())
            {
                //return context.Card.Where(x => x.Id == cardId).FirstOrDefault().CardWallets.Where(w => w.CardId == cardId).Select(x => x.Wallet).ToList();
                //return context.CardsWallets.Where(x => x.CardId == cardId).Select(y => y.Wallet).ToList();
                //return context.Wallet.Include(c => c.CardWallets.Where(x => x.CardId == cardId)).ToList();

                var query = from wallet in context.Wallet
                       join cw in context.CardsWallets on wallet.Id equals cw.WalletId
                       join card in context.Card on cw.CardId equals card.Id
                       where card.Id == cardId
                       select wallet;

                return query.ToList();
            }
        }

        public Wallet LastData()
        {
            using (var context = new HotWalletsContext())
            {
                return context.Wallet.OrderByDescending(x => x.Id).LastOrDefault();
            }
        }

        public void Update(Wallet wallet)
        {
            using (var context = new HotWalletsContext())
            {
                var updatedEntity = context.Entry(wallet);
                updatedEntity.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                context.SaveChanges();
            }
        }

        public Wallet WalletById(int id)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Wallet.FirstOrDefault(x => x.Id == id);
            }
        }
    }
}
