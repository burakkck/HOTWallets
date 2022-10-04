using System.Linq.Expressions;
using System.Security.Principal;
using HOTWallets.Models;
using Microsoft.EntityFrameworkCore;

namespace HOTWallets.DataAccess
{
    public class AccountDal : IAccountDal
    {
        public void Add(Account account)
        {
            using (var context = new HotWalletsContext())
            {
                context.Account.Add(account);
            }
        }

        public void Delete(Account account)
        {
            using (var context = new HotWalletsContext())
            {
                context.Account.Remove(account);
            }
        }

        public Account Get(Expression<Func<Account, bool>> filter)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Account.Where(filter).FirstOrDefault();
            }
        }

        public Account GetAccountByCardId(int cardId)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Account
                    .Include(x => x.Cards)
                    .Include(y => y.Categories)
                    .Where(x => x.Cards.Any(c => c.Id == cardId)).FirstOrDefault();
            }
        }

        public Account GetAccountById(int id)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Account
                    .Include(x => x.Cards)
                    .Include(y => y.Categories)
                    .Where(x => x.Id == id).FirstOrDefault();
            }
        }

        public void Update(Account account)
        {
            using (var context = new HotWalletsContext())
            {
                var updatedEntity = context.Entry(account);
                updatedEntity.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                context.SaveChanges();
            }
        }
    }
}
