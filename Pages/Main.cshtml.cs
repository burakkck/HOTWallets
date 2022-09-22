using System.Text.Json;
using HOTWallets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    public class MainModel : PageModel
    {
        public User User{get; set;}

        public void OnGet(string data)
        {
            User = JsonSerializer.Deserialize<User>(data);
            //if (String.IsNullOrWhiteSpace(HttpContext.Session.GetString("username")))
            //{
            //    return RedirectToPage("Index");
            //}
            //return Page();
        }
    }
}
