using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using war_API.Models;

namespace war_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        private readonly Random? _rand;

        //public Card RandomizeGenericListsMethods()
        //{
        //    _rand = new Random();
        //    return _rand;
        //}
        [HttpGet("getcards")]
        public List<Card> GetCards()
        {
            List<Card> cardList = new List<Card>
            {
                new Card{Id=101,CardName="2",Suit="Spades"},
                new Card{Id=102,CardName="3",Suit="Spades"},
                new Card{Id=103,CardName="4",Suit="Spades"},
                new Card{Id=104,CardName="5",Suit="Spades"},
                new Card{Id=105,CardName="6",Suit="Spades"},
                new Card{Id=106,CardName="7",Suit="Spades"},
                new Card{Id=107,CardName="8",Suit="Spades"},
                new Card{Id=108,CardName="9",Suit="Spades"},
                new Card{Id=109,CardName="10",Suit="Spades"},
                new Card{Id=110,CardName="J",Suit="Spades"},
                new Card{Id=111,CardName="Q",Suit="Spades"},
                new Card{Id=112,CardName="K",Suit="Spades"},
                new Card{Id=113,CardName="A",Suit="Spades"},
                new Card{Id=201,CardName="2",Suit="Hearts"},
                new Card{Id=202,CardName="3",Suit="Hearts"},
                new Card{Id=203,CardName="4",Suit="Hearts"},
                new Card{Id=204,CardName="5",Suit="Hearts"},
                new Card{Id=205,CardName="6",Suit="Hearts"},
                new Card{Id=206,CardName="7",Suit="Hearts"},
                new Card{Id=207,CardName="8",Suit="Hearts"},
                new Card{Id=208,CardName="9",Suit="Hearts"},
                new Card{Id=209,CardName="10",Suit="Hearts"},
                new Card{Id=210,CardName="J",Suit="Hearts"},
                new Card{Id=211,CardName="Q",Suit="Hearts"},
                new Card{Id=212,CardName="K",Suit="Hearts"},
                new Card{Id=213,CardName="A",Suit="Hearts"},
                new Card{Id=301,CardName="2",Suit="Clubs"},
                new Card{Id=302,CardName="3",Suit="Clubs"},
                new Card{Id=303,CardName="4",Suit="Clubs"},
                new Card{Id=304,CardName="5",Suit="Clubs"},
                new Card{Id=305,CardName="6",Suit="Clubs"},
                new Card{Id=306,CardName="7",Suit="Clubs"},
                new Card{Id=307,CardName="8",Suit="Clubs"},
                new Card{Id=308,CardName="9",Suit="Clubs"},
                new Card{Id=309,CardName="10",Suit="Clubs"},
                new Card{Id=310,CardName="J",Suit="Clubs"},
                new Card{Id=311,CardName="Q",Suit="Clubs"},
                new Card{Id=312,CardName="K",Suit="Clubs"},
                new Card{Id=313,CardName="A",Suit="Clubs"},
                new Card{Id=401,CardName="2",Suit="Diams"},
                new Card{Id=402,CardName="3",Suit="Diams"},
                new Card{Id=403,CardName="4",Suit="Diams"},
                new Card{Id=404,CardName="5",Suit="Diams"},
                new Card{Id=405,CardName="6",Suit="Diams"},
                new Card{Id=406,CardName="7",Suit="Diams"},
                new Card{Id=407,CardName="8",Suit="Diams"},
                new Card{Id=408,CardName="9",Suit="Diams"},
                new Card{Id=409,CardName="10",Suit="Diams"},
                new Card{Id=410,CardName="J",Suit="Diams"},
                new Card{Id=411,CardName="Q",Suit="Diams"},
                new Card{Id=412,CardName="K",Suit="Diams"},
                new Card{Id=413,CardName="A",Suit="Diams"},
            };
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

