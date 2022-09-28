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
            get;set;
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
        }
        [BindProperty]
        public Category Category

        {
            get; set;
        }
        
        public List<Card> Cards = new List<Card>();

        ICardDal _cardDal;
        IWalletDal _walletDal;
        ITransDal _transDal;
        ICardWalletDal _cardWalletDal;
        private readonly IHubContext<AppHub> _hub;
        private readonly IRazorPartialToStringRenderer _renderer;
        
        public MainModel(ICardDal cardDal, IWalletDal walletDal, ITransDal transDal, ICardWalletDal cardWalletDal, IHubContext<AppHub> hub, IRazorPartialToStringRenderer renderer)
        {
            _cardDal = cardDal;
            _walletDal = walletDal;
            _transDal = transDal;
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
            TransList = _transDal.GetTranssesByWalletId(id);
            Card = _cardDal.GetById(Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)));
            return Partial("_WalletDetail", this);
        }

        public IActionResult OnGetEditProfile(int id)
        {
            Card = _cardDal.GetById(id);
            return Partial("_EditProfile", Card);
        }

        public IActionResult OnGetExpense(int cardId, int walletId)
        {
            Card = _cardDal.GetById(cardId);
            Wallet = _walletDal.GetById(walletId);
            return Partial("_ExpenseAdd", this);
        }

        public IActionResult OnPostSaveExpense()
        {
            //Type 1 girdi, type 2 çýktý
            Category.Icon = Category.Id.ToString();
            Category.Type = 2;
            return Partial("");
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
