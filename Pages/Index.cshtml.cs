﻿using System.Security.Claims;
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
        public string Username
        {
            get; set;
        }
        [BindProperty]
        public string Password
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

        public IActionResult OnPostSignIn()
        {
            if (!String.IsNullOrWhiteSpace(Username) || !String.IsNullOrWhiteSpace(Password))
            {
                if (Users.Instance.Any(x => x.Username == Username && x.Password == Password))
                {
                    HttpContext.Session.SetString("username", Username);

                    var claims = new List<Claim>
                    {
                        new Claim (ClaimTypes.NameIdentifier, Username),
                        new Claim (ClaimTypes.Role, "Admin")
                    };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

                    return RedirectToPage("Main");
                }
                ViewData["errormessage"] = "Kullanıcı adı veya şifre hatalı";

                return Page();
            }

            return Page();
        }
    }
}