using System.Linq;
using System.Linq.Expressions;
using HOTWallets.Models;
using Microsoft.EntityFrameworkCore;

namespace HOTWallets.DataAccess
{
    public class WalletDal : IWalletDal
    {
        public Wallet Add(Wallet wallet)
        {
            using (var context = new HotWalletsContext())
            {
                context.Wallet.Add(wallet);
                context.SaveChanges();
            }
            return wallet;
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
                return context.Wallet.Include(x => x.Transactions).FirstOrDefault(filter);
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
                return context.Wallet
                    .Include(w => w.Transactions)
                    .ThenInclude(t => t.Category)
                    .Include(wlt => wlt.Transactions)
                    .ThenInclude(tr => tr.Card)
                    .Where(x => x.Id == id).FirstOrDefault();
            }
        }

        public List<Wallet> GetWalletsByCardId(int cardId)
        {
            using (var context = new HotWalletsContext())
            {
                //return context.Card.Where(x => x.Id == cardId).FirstOrDefault().CardWallets.Where(w => w.CardId == cardId).Select(x => x.Wallet).ToList();
                //return context.CardsWallets.Where(x => x.CardId == cardId).Select(y => y.Wallet).ToList();
                //return context.Wallet.Include(c => c.CardWallets.Where(x => x.CardId == cardId)).ToList();

                //Cwallets = context.CardsWallets.Where(i => i.CardId == cardId).ToList(); //.Select(x => x.WalletId).ToList().ForEach(x => wallets.Add(context.Wallet.Where(y => y.Id == Convert.ToInt32(x))));


                return context.CardsWallets.Include(cw => cw.Wallet).Where(q => q.CardId == cardId).Select(s => s.Wallet).ToList();


                //var query = from wallet in context.Wallet
                //            join cw in context.CardsWallets on wallet.Id equals cw.WalletId
                //            where cw.CardId == cardId
                //            select wallet;

                //return query.OrderBy(i => i.Id).ToList();
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
