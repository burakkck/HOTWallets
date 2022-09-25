using System.Text.Json;
using HOTWallets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    public class MainModel : PageModel
    {
        public Card Card{get; set;}

        public void OnGet(string data)
        {
            Card = JsonSerializer.Deserialize<Card>(data);
            //if (String.IsNullOrWhiteSpace(HttpContext.Session.GetString("Cardname")))
            //{
            //    return RedirectToPage("Index");
            //}
            //return Page();
        }
    }
}
