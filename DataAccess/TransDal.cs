using System.Diagnostics;
using System.Linq.Expressions;
using HOTTranss.DataAccess;
using HOTWallets.Models;
using Microsoft.EntityFrameworkCore;

namespace HOTWallets.DataAccess
{
    public class TransDal : ITransDal
    {
        public void Add(Trans trans)
        {
            using (var context = new HotWalletsContext())
            {
                context.Trans.Add(trans);
                context.SaveChanges();
            }
            
        }

        public void Delete(Trans trans)
        {
            using (var context = new HotWalletsContext())
            {
                context.Trans.Remove(trans);
                context.SaveChanges();
            }
        }

        public Trans Get(Expression<Func<Trans, bool>> filter)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Trans.Where(filter).FirstOrDefault();
            }
        }

        public List<Trans> GetTranssesByWalletId(int id)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Trans.Where(x => x.WalletId == id).ToList();

            }
        }

        public Trans GetTransById(int id)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Trans
                    .Include(t => t.Category)
                    .Include(t => t.Card)
                    .Where(x => x.Id == id).FirstOrDefault();
            }
        }

        public void Update(Trans trans)
        {
            using (var context = new HotWalletsContext())
            {
                var updatedEntity = context.Entry(trans);
                updatedEntity.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                context.SaveChanges();
            }
        }
    }
}
