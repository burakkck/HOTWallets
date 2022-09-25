﻿using System.Linq.Expressions;
using HOTWallets.Models;

namespace HOTWallets.DataAccess
{
    public class CardDal : ICardDal
    {
        public void Add(Card card)
        {
            using (var context = new HotWalletsContext())
            {
                context.Card.Add(card);
                context.SaveChanges();
            }
        }

        public void Delete(Card card)
        {
            using (var context = new HotWalletsContext())
            {
                context.Card.Remove(card);
                context.SaveChanges();
            }
        }

        public Card Get(Expression<Func<Card, bool>> filter)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Set<Card>().SingleOrDefault(filter);
            }
        }

        public bool CardCheck(Expression<Func<Card, bool>> filter)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Card.Any(filter);
            }
        }

        public Card GetById(int id)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Card.FirstOrDefault(x => x.Id == id);
            }
        }

        public List<Card> GetCardsByWalletId(int walletId)
        {
            using (var context = new HotWalletsContext())
            {
                return context.Wallets.Where(x => x.Id == walletId).FirstOrDefault().Cards;
            }
        }

        public void Update(Card card)
        {
            using (var context = new HotWalletsContext())
            {
                var updatedEntity = context.Entry(card);
                updatedEntity.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                context.SaveChanges();
            }
        }
    }
}