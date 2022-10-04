using System.Security.Claims;
using System.Text.Json;
using HOTWallets.DataAccess;
using HOTWallets.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        [BindProperty]
        public Card Card
        {
            get; set;
        }
        public List<Wallet> Wallets
        {
            get; set;
        }

        private ICardDal _cardDal;
        private IWalletDal _walletDal;
        public IndexModel(ILogger<IndexModel> logger, ICardDal cardDal, IWalletDal walletDal)
        {
            _logger = logger;
            _cardDal = cardDal;
            _walletDal = walletDal;
        }

        public void OnGet()
        {

        }

        public IActionResult OnGetSignUp()
        {
            return Partial("_Register");
        }

        public IActionResult OnPostSignIn(string username, string password)
        {

            if (!String.IsNullOrWhiteSpace(username) || !String.IsNullOrWhiteSpace(username))
            {
                if (_cardDal.CardCheck(x=> x.Username == username && x.Password == password, out var card))
                {
                    Card = card;
                    //Card = _cardDal.Get(x => x.Username == username && x.Password == password);
                    var result = _walletDal.GetWalletsByCardId(Card.Id);
                    MainPageDataModel dataModel = new MainPageDataModel
                    {
                        Id = Card.Id,
                        FirstName = Card.FirstName,
                        LastName = Card.LastName,
                        Email = Card.Email,
                        Username = Card.Username
                    };
                    dataModel.Wallets = result;
                    //HttpContext.Session.Set<MainPageDataModel>("userinfo", dataModel);
                    //MainPageDataModel model = HttpContext.Session.Get<MainPageDataModel>("userinfo");

                    //HttpContext.Response.Cookies.Append("username", Username);

                    var claims = new List<Claim>
                    {
                        new Claim (ClaimTypes.NameIdentifier, Card.Id.ToString()),
                        new Claim (ClaimTypes.Name, Card.Username),
                        new Claim (ClaimTypes.Role, "Admin")
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                    return RedirectToPage("Main", new { data = JsonSerializer.Serialize(dataModel) });
                    //return RedirectToPage("Main", new { data = Card.Id.ToString() });
                }
                ViewData["errormessage"] = "Kullanıcı adı veya şifre hatalı";

                return Page();
            }

            return Page();
        }

        public IActionResult OnPostCreateAcc()
        {
            Wallet wallet = new Wallet { Name = "My Wallet", Balance = 0,  };
            Account account = new Account { Name = Card.Username };
            Card.Account = account;
            Card.CardWallets.Add(new CardWallet { Wallet = wallet });
            _cardDal.Add(Card);
            //_walletDal.Add(new Wallet {Balance = 0, Name = "My Wallet" });
            //var lastWallet =  _walletDal.GetAll().OrderByDescending(x => x.Id).First();
            var lastWallet = _walletDal.LastData();
            return RedirectToPage("Index");

        }
    }
}