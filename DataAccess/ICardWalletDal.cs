using HOTWallets.Models;

namespace HOTWallets.DataAccess
{
    public interface ICardWalletDal
    {
        CardWallet GetWalletIdsByCardId(int id);
        CardWallet GetCardIdsByWalletId(int id);
        void Add(CardWallet cardWallet);
        void Delete(CardWallet cardWallet);
        void Update(CardWallet cardWallet);
    }
}
