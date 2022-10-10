using HOTWallets.DataAccess;
using HOTWallets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HOTWallets.Pages
{
    [Authorize(Roles = "admin")]
    public class AccountSettingsModel : PageModel
    {
        public Account Account
        {
            get; set;
        } = new Account();

        private IAccountDal _accountDal;
        public AccountSettingsModel(IAccountDal accountDal)
        {
            _accountDal = accountDal;
        }
        public void OnGet(int Id)
        {
            Account = _accountDal.GetAccountById(Id);
        }
    }
}
