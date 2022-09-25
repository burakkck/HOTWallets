﻿using Microsoft.AspNetCore.Mvc;

namespace HOTWallets.Models
{
    public class Card
    {
        public int Id
        {
            get; set;
        }
        public string Username
        {
            get; set;
        }
        public string FirstName
        {
            get; set;
        }
        public string LastName
        {
            get; set;
        }
        public string Email
        {
            get; set;
        }
        public string Password
        {
            get; set;
        }
        public string Role
        {
            get; set;
        } = "Admin";
        public List<Wallet> Wallets
        {
            get; set;
        }
    }

    public class Cards : List<Card>
    {
        private Cards()
        {
        }
        private static Cards _Instance = null;
        public static Cards Instance
        {
            get
            {
                if (_Instance == null)
                {
                    _Instance = new Cards();
                    Instance.Add(new Card { FirstName = "Burak", LastName = "Küçük", Id = 1, Email = "burakkucuk@gmail.com", Username = "burakkucuk", Password = "1234567" });
                }
                return _Instance;
            }
        }
    }

}