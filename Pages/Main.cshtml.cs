using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    public class MainModel : PageModel
    {
        public void OnGet()
        {
            //if (String.IsNullOrWhiteSpace(HttpContext.Session.GetString("username")))
            //{
            //    return RedirectToPage("Index");
            //}
            //return Page();
        }
    }
}
