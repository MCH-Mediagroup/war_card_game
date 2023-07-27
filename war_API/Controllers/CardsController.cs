using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using war_API.Models;

namespace war_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        // private readonly Random? _rand;

        //public Card RandomizeGenericListsMethods()
        //{
        //    _rand = new Random();
        //    return _rand;
        //}
        [HttpGet("getcards")]
        public List<Card> GetCards()
        {
            List<Card> cardList = new List<Card>{};
                string[] suits, cardFace;
                int id = 0;
          
                suits = new string[4]{ "spades", "hearts", "clubs", "diams" };
                cardFace = new string [13]{ "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A" };

                for (int s = 0; s < suits.Count() ; s++) {
                    var suitNew = suits[s][0].ToString();
                    for (int n = 0; n < cardFace.Count() ; n++) {
                        var cardItem = new Card();
                        id++;
                        cardItem.Id = id;
                        cardItem.suit = suits[s];
                        cardItem.num = cardFace[n];
                        cardItem.cardValue = n + 2;
                        cardItem.icon = suitNew;
                        cardList.Add(cardItem);
                    }
                }

                var retcardList = GenerateRandomLoop(cardList);

                 return retcardList;
        }
        private List<Card> GenerateRandomLoop(List<Card> listToShuffle)
        {
            var rng = new Random();

            for (int i = listToShuffle.Count - 1; i > 0; i--)
            {
                var k = rng.Next(i + 1);
                var value = listToShuffle[k];
                listToShuffle[k] = listToShuffle[i];
                listToShuffle[i] = value;
            }

            return listToShuffle;
        }
    }

}

