using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    public class StimulusModel : PageModel
    {
        public void OnGet()
        {

        }

        public IActionResult OnGetAddData()
        {
            return new EmptyResult();
        }
    }
}
