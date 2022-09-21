using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    [Authorize]
    public class MainModel : PageModel
    {
        public IActionResult OnGet()
        {
            if (String.IsNullOrWhiteSpace(HttpContext.Session.GetString("username")))
            {
                return RedirectToPage("Index");
            }
            return Page();
        }
    }
}
