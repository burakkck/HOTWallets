using HOTWallets.Models;
using System.Linq.Expressions;

namespace HOTWallets.DataAccess
{
    public interface ICategoryDal
    {
        Category Get(Expression<Func<Category, bool>> filter);
        Category GetById(int id);
        List<Category> GetCategoriesByAccountId(int walletId);
        void Add(Category category);
        void Update(Category category);
        void Delete(Category category);
    }
}
