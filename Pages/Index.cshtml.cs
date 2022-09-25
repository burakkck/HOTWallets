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

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
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
                var cardDal = new CardDal();
                if (cardDal.CardCheck(x=> x.Username == username && x.Password == password))
                {
                    Card = cardDal.Get(x => x.Username == username && x.Password == password);
                    Card.Password = null;
                    //HttpContext.Session.SetString("username", Username);
                    //HttpContext.Response.Cookies.Append("username", Username);

                    var claims = new List<Claim>
                    {
                        new Claim (ClaimTypes.NameIdentifier, Card.Username),
                        new Claim (ClaimTypes.Role, "Admin")
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                    return RedirectToPage("Main", new { data = JsonSerializer.Serialize(Card) });
                }
                ViewData["errormessage"] = "Kullanıcı adı veya şifre hatalı";

                return Page();
            }

            return Page();
        }

        public IActionResult OnPostCreateAcc()
        {
            var cardDal = new CardDal();
            cardDal.Add(Card);

            return RedirectToPage("Index");

        }
    }
}