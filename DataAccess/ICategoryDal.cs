using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTWallets.DataAccess
{
    public interface ICategoryDal
    {
        Category Get(Expression<Func<Category, bool>> filter);
        Category GetById(int id);
        IList<Category> GetCategorysByWalletId(int walletId);
        void Add(Category Category);
        void Update(Category Category);
        void Delete(Category Category);
    }
}
