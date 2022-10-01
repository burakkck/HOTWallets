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

namespace HOTWallets.Pages
{
    public class MainModel : PageModel
    {
        [BindProperty]
        public Card Card
        {
            get; set;
        }

        [BindProperty]
        public Wallet Wallet
        {
            get; set;
        }

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
        public Trans Trans
        {
            get; set;
        } = new Trans();
        [BindProperty]
        public Category Category

        {
            get; set;
        }
        public string ConvertedPrice
        {
            get; set;
        }
        public List<Card> Cards = new List<Card>();

        ICardDal _cardDal;
        IWalletDal _walletDal;
        ITransDal _transDal;
        ICategoryDal _categoryDal;
        ICardWalletDal _cardWalletDal;
        private readonly IHubContext<AppHub> _hub;
        private readonly IRazorPartialToStringRenderer _renderer;

        public MainModel(ICardDal cardDal, IWalletDal walletDal, ITransDal transDal, ICardWalletDal cardWalletDal, ICategoryDal categoryDal, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer)
        {
            _cardDal = cardDal;
            _walletDal = walletDal;
            _transDal = transDal;
            _categoryDal = categoryDal;
            _cardWalletDal = cardWalletDal;
            _hub = hub;
            _renderer = renderer;
        }

        public void OnGet(string data)
        {
            MainPageDataModel = JsonSerializer.Deserialize<MainPageDataModel>(data);
            //if (String.IsNullOrWhiteSpace(HttpContext.Session.GetString("Cardname")))
            //{
            //    return RedirectToPage("Index");
            //}
            //return Page();
            Cards = _cardDal.GetAll();
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

        public IActionResult OnGetAddTrans(int cardId, int walletId, string type, int transid)
        {
            if(transid > 0)
            {
                Trans = _transDal.GetTransById(transid);
                //string convertedPrice = ((decimal)(Trans.Price)).ToString(CultureInfo.InvariantCulture);
            } else
            {
                Trans.Type = type;
            }
            Card = _cardDal.GetById(cardId);
            Wallet = _walletDal.GetById(walletId);
           
            return Partial("_TransAdd", this);
        }


        public IActionResult OnPostSaveTrans()
        {
            Wallet wallet = new Wallet();
            //Type 1 girdi, type 2 çýktý
            if (Trans.Id == 0)
            {
                Trans.CategoryId = Category.Id;
                Trans.CardId = Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));
                _transDal.Add(Trans);

                wallet = _walletDal.GetById(Trans.WalletId);

                if (Trans.Type == "Expense")
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
                _transDal.Update(Trans);

                wallet = _walletDal.GetById(Trans.WalletId);
                if (Trans.Type == "Expense")
                {
                    wallet.Balance = (decimal)(wallet.Balance - Trans.Price);
                } else
                {
                    wallet.Balance = (decimal)(wallet.Balance + Trans.Price);
                }
                _walletDal.Update(wallet);
            }


            return OnGetGetWallet(wallet.Id);
        }

        public IActionResult OnGetDeleteTransaction(int id, int walletid)
        {
            var transaction = _transDal.GetTransById(id);
            var wallet = _walletDal.GetById(walletid);
            if(transaction.Type == "Expense")
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
            Trans = _transDal.GetTransById(transid);
            Response.ContentType = "text/vnd.turbo-stream.html";
            return Partial("_CancelAddTrans", Trans);
        }

        public IActionResult OnPostCreateWallet()
        {
            string users = Request.Form["userIds"];
            var userids = users.Split(',').Select(x => Convert.ToInt32(x)).ToList();
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

        public IActionResult OnGetSignOut()
        {
            if (HttpContext.Request.Cookies.Count > 0)
            {
                var siteCookies = HttpContext.Request.Cookies.Where(c => c.Key.Contains(".AspNetCore.") || c.Key.Contains("Microsoft.Authentication"));
                foreach (var cookie in siteCookies)
                {
                    Response.Cookies.Delete(cookie.Key);
                }
            }

            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            HttpContext.Session.Clear();
            return RedirectToPage("/Index");
        }

        public IActionResult OnGetCancelEditProfile(string card)
        {
            return Partial("_ProfileInfo", JsonSerializer.Deserialize<MainPageDataModel>(card));
        }

        public IActionResult OnPostEditAcc()
        {
            _cardDal.Update(Card);
            Response.ContentType = "text/vnd.turbo-stream.html";
            return Partial("_ChangeUserInfo", MainPageDataModel);
            //return Partial("_ProfileInfo", MainPageDataModel);
        }
    }
}
