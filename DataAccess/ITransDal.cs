using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTTranss.DataAccess
{
    public interface ITransDal
    {
        Trans Get(Expression<Func<Trans, bool>> filter);
        Trans TransById(int id);
        List<Trans> GetTranssesByWalletId(int id);
        void Add(Trans trans);
        void Update(Trans trans);
        void Delete(Trans trans);
    }
}
