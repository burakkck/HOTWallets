using System.Linq.Expressions;
using HOTWallets.Models;

namespace HOTWallets.DataAccess
{
    public class CategoryDal : ICategoryDal
    {
        public void Add(Category category)
        {
            using (HotWalletsContext context = new HotWalletsContext())
            {
                context.Category.Add(category);
                context.SaveChanges();
            }
        }

        public void Delete(Category category)
        {
            using (HotWalletsContext context = new HotWalletsContext())
            {
                context.Category.Remove(category);
                context.SaveChanges();
            }
        }

        public Category Get(Expression<Func<Category, bool>> filter)
        {
            using (HotWalletsContext context = new HotWalletsContext())
            {
                return context.Category.Where(filter).FirstOrDefault();
            }
        }

        public List<Category> GetByType(Expression<Func<Category, bool>> filter)
        {
            using (HotWalletsContext context = new HotWalletsContext())
            {
                return context.Category.Where(filter).ToList();
            }
        }

        public Category GetById(int id)
        {
            using (HotWalletsContext context = new HotWalletsContext())
            {
                return context.Category.Where(x => x.Id == id).FirstOrDefault();
            }
        }

        public List<Category> GetCategoriesByAccountId(int walletId)
        {
            throw new NotImplementedException();
        }

        public void Update(Category category)
        {
            using (HotWalletsContext context = new HotWalletsContext())
            {
                var updatedEntity = context.Entry(category);
                updatedEntity.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                context.SaveChanges();
            }
        }
    }
}
