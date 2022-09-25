using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTTranss.DataAccess
{
    public interface ITransDal
    {
        Trans Get(Expression<Func<Trans, bool>> filter);
        Trans TransById(int id);
        IList<Trans> GetTranssByCardId(Expression<Func<Trans, bool>> filter = null);
        void Add(Trans Trans);
        void Update(Trans Trans);
        void Delete(Trans Trans);
    }
}
