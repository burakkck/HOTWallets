using System.Text.Json;
using HOTWallets.DataAccess;
using HOTWallets.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using HOTTranss.DataAccess;

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

        ICardDal _cardDal;
        IWalletDal _walletDal;
        ITransDal _transDal;
        public MainModel(ICardDal cardDal, IWalletDal walletDal, ITransDal transDal)
        {
            _cardDal = cardDal;
            _walletDal = walletDal;
            _transDal = transDal;
        }

        public void OnGet(string data)
        {
            MainPageDataModel = JsonSerializer.Deserialize<MainPageDataModel>(data);
            //if (String.IsNullOrWhiteSpace(HttpContext.Session.GetString("Cardname")))
            //{
            //    return RedirectToPage("Index");
            //}
            //return Page();
        }

        public IActionResult OnGetGetWallet(int id)
        {
            Wallet = _walletDal.GetById(id);
            TransList = _transDal.GetTranssesByWalletId(id);
            return Partial("_WalletDetail", this);
        }

        public IActionResult OnGetEditProfile(int id)
        {
            Card = _cardDal.GetById(id);
            return Partial("_EditProfile", Card);
        }

        public IActionResult OnGetExpense()
        {
            return Partial(""); 
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
            return Partial("_ProfileInfo", MainPageDataModel);
        }
    }
}
