using HOTWallets.Models;

namespace HOTWallets.DataAccess
{
    public class CardWalletDal : ICardWalletDal
    {
        public void Add(CardWallet cardWallet)
        {
            using (var context = new HotWalletsContext())
            {
                context.Add(cardWallet);
                context.SaveChanges();
            }
        }

        public void Delete(CardWallet cardWallet)
        {
            throw new NotImplementedException();
        }

        public CardWallet GetCardIdsByWalletId(int id)
        {
            throw new NotImplementedException();
        }

        public CardWallet GetWalletIdsByCardId(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(CardWallet cardWallet)
        {
            throw new NotImplementedException();
        }
    }
}
