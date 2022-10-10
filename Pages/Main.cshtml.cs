using System.Text.Json;
using HOTWallets.DataAccess;
using HOTWallets.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using HOTTranss.DataAccess;
using HOTWallets.Hubs;
using HOTWallets.Services;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Globalization;
using HOTWallets.Utilities;

namespace HOTWallets.Pages
{
    public class MainModel : PageModel
    {
        [BindProperty]
        public Card Card
        {
            get; set;
        } = new Card();

        [BindProperty]
        public Wallet Wallet
        {
            get; set;
        } = new Wallet();

        [BindProperty]
        public List<Trans> TransList
        {
            get; set;
        }

        [BindProperty]
        public MainPageDataModel MainPageDataModel
        {
            get; set;
        }
        [BindProperty]
        public Account Account
        {
            get; set;
        } = new Account();
        [BindProperty]
        public Trans Trans
        {
            get; set;
        } = new Trans();
        [BindProperty]
        public Category Category

        {
            get; set;
        } = new Category();
        public string ConvertedPrice
        {
            get; set;
        }
        public List<Card> AccountCards = new List<Card>();
        public List<Wallet> CardWallets = new List<Wallet>();
        public List<Category> Categories = new List<Category>();


        ICardDal _cardDal;
        IWalletDal _walletDal;
        ITransDal _transDal;
        ICategoryDal _categoryDal;
        ICardWalletDal _cardWalletDal;
        IAccountDal _accountDal;
        private readonly IHubContext<AppHub> _hub;
        private readonly IRazorPartialToStringRenderer _renderer;

        public MainModel(ICardDal cardDal, IWalletDal walletDal, ITransDal transDal, ICardWalletDal cardWalletDal, ICategoryDal categoryDal, IAccountDal accountDal, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer)
        {
            _cardDal = cardDal;
            _walletDal = walletDal;
            _transDal = transDal;
            _categoryDal = categoryDal;
            _cardWalletDal = cardWalletDal;
            _accountDal = accountDal;
            _hub = hub;
            _renderer = renderer;
        }

        public void OnGet()
        {
            Card = _cardDal.Get(x=> x.Id == Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            CardWallets = _walletDal.GetWalletsByCardId(Card.Id);
            AccountCards = _cardDal.GetAll(x=> x.AccountId == Card.AccountId);
        }

        public IActionResult OnGetGetWallet(int id)
        {
            Wallet = _walletDal.GetById(id);
            //TransList = _transDal.GetTranssesByWalletId(id);
            Card = _cardDal.GetById(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            return Partial("_WalletDetail", this);
        }

        public IActionResult OnGetEditProfile(int id)
        {
            Card = _cardDal.GetById(id);
            return Partial("_EditProfile", Card);
        }

        
        public IActionResult OnGetAccountSettings()
        {
            Account = _accountDal.GetAccountByCardId(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            return RedirectToPage("AccountSettings", new { Id = Account.Id});
        }

        public IActionResult OnGetEditAccount(int accountId)
        {
            Account = _accountDal.GetAccountById(accountId);
            return Partial("_EditAccount", Account);
        }

        public async Task<IActionResult> OnPostSaveAccount()
        {
            _accountDal.Update(Account);

            var renderedViewStr = await _renderer.RenderPartialToStringAsync("../Pages/_UpdateAccount", Account);
            await _hub.Clients.All.SendAsync("AccountChanged", renderedViewStr);
            return new EmptyResult();

            //Response.ContentType = "text/vnd.turbo-stream.html";
            //return Partial("_UpdateAccount", Account);
        }

        public IActionResult OnGetCancelAccount(int accountId, string name)
        {
            Account = new Account();
            Account.Id = accountId;
            Account.Name = name;
            return Partial("_AccountInfo", Account);
        }

        public IActionResult OnGetAddAccountUser(int accountId)
        {
            Card.AccountId = accountId;
            return Partial("_AddAccountUser", Card);
        }

        public IActionResult OnPostSaveAccountUser()
        {
            _cardDal.Add(Card);
            Account = _accountDal.GetAccountByCardId(Card.Id);
            Response.ContentType = "text/vnd.turbo-stream.html";
            return Partial("_AddedAccountUser", Account);
        }

        public PartialViewResult OnGetAddWallet()
        {
            Account =  _accountDal.GetAccountByCardId(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            return Partial("_NewWallet", this);
        }

        public IActionResult OnGetWalletsForNavbar()
        {
            List<Wallet> list = new List<Wallet>();
            list = _walletDal.GetWalletsByCardId(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));

            //Wallet = _walletDal.GetById(walletId);
            return Partial("_WalletsForNavbar", list);
        }

        public IActionResult OnGetAddTrans(int cardId, int walletId, string type, int transid)
        {
            if (transid > 0)
            {
                Trans = _transDal.GetTransById(transid);
                //string convertedPrice = ((decimal)(Trans.Price)).ToString(CultureInfo.InvariantCulture);
            } else
            {
                Trans.Type = type;
            }

            int accountId = _accountDal.GetAccountByCardId(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier))).Id;
            if (type == null)
            {
                Categories = _categoryDal.GetByAccountAndType(x => x.Type == Trans.Type && x.AccountId == accountId);
            } else
            {
                Categories = _categoryDal.GetByAccountAndType(x => x.Type == type && x.AccountId == accountId);
            }
            
            Card = _cardDal.GetById(cardId);
            Wallet = _walletDal.GetById(walletId);
           
            return Partial("_TransAdd", this);
        }

        public IActionResult OnGetCancelAddAccountUser(int accountId)
        {
            Account = _accountDal.GetAccountById(accountId);
            return Partial("_AccountUsers", Account);
        }

        public IActionResult OnPostSaveTrans(int catid)
        {

            Wallet wallet = new Wallet();
            //Type 1 girdi, type 2 çýktý
            if (Trans.Id == 0)
            {
                Trans.CategoryId = Category.Id;
                Trans.CardId = Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));
                _transDal.Add(Trans);

                wallet = _walletDal.GetById(Trans.WalletId);

                if (Trans.Type == "expense")
                {
                    wallet.Balance = (decimal)(wallet.Balance - Trans.Price);
                } else
                {
                    wallet.Balance = (decimal)(wallet.Balance + Trans.Price);
                }
                _walletDal.Update(wallet);
            } else
            {
                Trans.CategoryId = Category.Id;
                Trans.CardId = Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var tra = _transDal.GetTransById(Trans.Id);
                var diff = Trans.Price - tra.Price;
                _transDal.Update(Trans);

                wallet = _walletDal.GetById(Trans.WalletId);
                
                if (Trans.Type == "expense")
                {
                    wallet.Balance = (decimal)(wallet.Balance - diff);
                } else
                {
                    wallet.Balance = (decimal)(wallet.Balance + diff);
                }
                _walletDal.Update(wallet);
            }

            return OnGetGetWallet(wallet.Id);
        }

        public IActionResult OnGetDeleteTransaction(int id, int walletid)
        {
            var transaction = _transDal.GetTransById(id);
            var wallet = _walletDal.GetById(walletid);
            if(transaction.Type == "expense")
            {
                wallet.Balance = (decimal)(wallet.Balance + transaction.Price);
            } else
            {
                wallet.Balance = (decimal)(wallet.Balance - transaction.Price);
            }
            _walletDal.Update(wallet);
            _transDal.Delete(transaction);

            return OnGetGetWallet(walletid);

        }

        public IActionResult OnGetCancelTransAdd(int walletId, int transid)
        {
            if(transid > 0)
                Trans = _transDal.GetTransById(transid);

            Response.ContentType = "text/vnd.turbo-stream.html";
            return Partial("_CancelAddTrans", Trans);
        }

        public IActionResult OnPostCreateWallet()
        {
            string users = Request.Form["userIds"];

            var userids = users.Split(',').Select(x => Convert.ToInt32(x)).ToList();
            userids.Add(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            Wallet = _walletDal.Add(Wallet);

            foreach (var userid in userids)
            {
                CardWallet cardWallet = new CardWallet
                {
                    CardId = userid,
                    WalletId = Wallet.Id
                };
                _cardWalletDal.Add(cardWallet);
            }
            Response.ContentType = "text/vnd.turbo-stream.html";
            return Partial("_WalletsView", this);
        }

        public IActionResult OnGetAddCategory(int accountId)
        {
            Category.AccountId = accountId;
            return Partial("_AddCategory", Category);
        }

        public IActionResult OnPostSaveCategory()
        {
            var value = Request.Form["category-icon"].ToString();
            Category.Icon = value;
            if (Category.Id > 0)
            {
                _categoryDal.Update(Category);
            } else
            {
                _categoryDal.Add(Category);
            }
            
            //TO DO use turbo stream
            Account = _accountDal.GetAccountById(Category.AccountId);
            //return Partial("_AddedCategory", Category);
            return Partial("_AccountCategories", Account);
        }

        public IActionResult OnGetShowWallet(int id)
        {
            Wallet = _walletDal.GetById(id);
            return Partial("_ShowWallet", Wallet);
        }

        public IActionResult OnGetEditCategory(int categoryId)
        {
            Category = _categoryDal.GetById(categoryId);
            return Partial("_AddCategory", Category);
        }

        public IActionResult OnGetCancelAddEditCategory(int accountId)
        {
            Account = _accountDal.GetAccountById(accountId);
            return Partial("_AccountCategories", Account);
        }

        public IActionResult OnGetCancelEditProfile(int cardId)
        {
            Card = _cardDal.GetById(cardId);
            return Partial("_ProfileInfo", Card);
        }

        public IActionResult OnPostEditAcc()
        {
            Card.AccountId = _accountDal.GetAccountByCardId(Card.Id).Id;
            _cardDal.Update(Card);
            Response.ContentType = "text/vnd.turbo-stream.html";
            return Partial("_ChangeUserInfo", Card);
            //return Partial("_ProfileInfo", MainPageDataModel);
        }
    }
}
