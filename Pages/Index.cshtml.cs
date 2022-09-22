using System.Security.Claims;
using System.Text.Json;
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
        public User User { get; set; }

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
                if (Users.Instance.Any(x => x.Username == username && x.Password == password))
                {
                    User = Users.Instance.FirstOrDefault(x => x.Username == username && x.Password == password);
                    User.Password = null;
                    //HttpContext.Session.SetString("username", Username);
                    //HttpContext.Response.Cookies.Append("username", Username);

                    var claims = new List<Claim>
                    {
                        new Claim (ClaimTypes.NameIdentifier, User.Username),
                        new Claim (ClaimTypes.Role, "Admin")
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                    

                    return RedirectToPage("Main", new { data = JsonSerializer.Serialize(User) });
                }
                ViewData["errormessage"] = "Kullanıcı adı veya şifre hatalı";

                return Page();
            }

            return Page();
        }

        public IActionResult OnPostCreateAcc()
        {
            if (ModelState.IsValid)
            {
                if (User.Id == 0)
                    User.Id = Users.Instance.Count + 1;

                Users.Instance.Add(User);
            }
            return RedirectToPage("Index");

        }
    }
}