using System.Diagnostics.Eventing.Reader;
using HOTTranss.DataAccess;
using HOTWallets.DataAccess;
using HOTWallets.Hubs;
using HOTWallets.Services;
using HOTWallets.Utilities;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.

builder.Services.AddRazorPages(
    options =>
    {
        options.Conventions.AuthorizePage("/Main");
        options.Conventions.AllowAnonymousToPage("/Index");
    }
    );


builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.IsEssential = true;
    options.Cookie.HttpOnly = true;
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.Cookie.Name = "HotWallets";
        options.EventsType = typeof(CustomCookieAuthenticationEvents);
        options.LoginPath = "/Index";
        options.AccessDeniedPath = "/Index";
    });

builder.Services.AddScoped<CustomCookieAuthenticationEvents>();
builder.Services.AddScoped<ICardDal, CardDal>();
builder.Services.AddScoped<IWalletDal, WalletDal>();
builder.Services.AddScoped<ITransDal, TransDal>();
builder.Services.AddScoped<ICardWalletDal, CardWalletDal>();
builder.Services.AddScoped<ICategoryDal, CategoryDal>();
builder.Services.AddScoped<IAccountDal, AccountDal>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IRazorPartialToStringRenderer, RazorPartialToStringRenderer>();

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapRazorPages();

app.MapHub<AppHub>("/appHub");

app.Run();

