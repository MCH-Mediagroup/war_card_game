import { useRef, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from 'react-bootstrap/Button';

import './War.css';

import {
    saveGameOver,
    saveWinStatus,
    savePlayerCards
  } from '../store/interactions'
// import { setGameOver, setPlayer1Cards } from '../store/reducers/wargame';
  

const Game = (props) => {
  const slowtime = useSelector(state => state.wargame.slowtime)
  const playtime = useSelector(state => state.wargame.playtime)
  const playgame = useSelector(state => state.wargame.playgame)
  const winstatus = useSelector(state => state.wargame.winstatus)
  const gameover = useSelector(state => state.wargame.gameover)


  let [data, setCards] = useState([])

  const dispatch = useDispatch()

  const fetchCardData = () => {
    fetch("http://192.168.254.133:5050/api/Cards/getcards")
      .then(res => res.json())
      .then(data => {
          setCards(data)
        //   console.log(data)
        })
         //console.log(cards)
      }

      useEffect(() => {
        fetchCardData()
    }, []);

    // Cards Game below this comment

    var cards = data;
    var players = [
        [],
        []
    ];
    var firstRun = true;
    // var gameover = false;
    var timer;
    var r = 0;

    var p1 = document.querySelector("#player1 .hand");
    var p2 = document.querySelector("#player2 .hand");
    var s1 = document.querySelector("#player1 .score");
    var s2 = document.querySelector("#player2 .score");

    //event listeners
    // fightButton.addEventListener('click', battle);
    // fightButton10.addEventListener('click', function () {
    //     rounds(10);
    // });
    // fightButton50.addEventListener('click', function () {
    //     rounds(50);
    // });

    
              //functions
            //   function rounds(a) {
            //     r = a;
            //     timer = setInterval(function () {
            //         battle()
            //     }, 100);
            // }
    
            function battle() {
                if (timer) {
                    r--;
                    outputMessage("Rounds left " + r);
                    if (r < 1) {
                        window.clearInterval(timer);
                    }
                }
                if (firstRun) {
                    firstRun = false;
                    // buildCards();
                    // shuffleArray(cards);
                    dealCards(cards);
                }
                attack();
            }

            const attack = () => {
                if (!gameover) {
                    var card1 = players[0].shift();
                    var card2 = players[1].shift();
                    var pot = [card1, card2];
                    p1.innerHTML = showCard(card1, 0);
                    p2.innerHTML = showCard(card2, 0);
                    checkWinner(card1, card2, pot);
                    // props.onSavePlayer1Cards(players[0].length);
                    // props.onSavePlayer2Cards(players[1].length);
                    s1.innerHTML = players[0].length; 
                    s2.innerHTML = players[1].length; 
                    // await savePlayerCards(players[0].length, players[1].length, dispatch)
                } else {
                    outputMessage("Game over");
                }
            }
    
            function outputMessage(message) {
                document.getElementById("message").innerHTML = message;
            }
            const checkWinner = (card1, card2, pot) => {
                if ((players[0].length <= 4) || (players[1].length <= 4)) {

                    saveGameOver(true, dispatch)
                    saveWinStatus (
                        (players[1].length <= 4) ? (
                            1
                        ) : players[1].length === players[0].length ? (
                            3
                        ) : 0
                    )
                    return;
                }
                if (card1.cardValue > card2.cardValue) {
                    outputMessage("Player 1 wins");
                    players[0] = players[0].concat(pot);
                }
                else if (card1.cardValue < card2.cardValue) {
                    outputMessage("Player 2 wins");
                    players[1] = players[1].concat(pot);
                } else {
                    battlemode(pot);
                    outputMessage("Battle Mode");
                }

            }

            // function checkWinner(card1, card2, pot) {
            //     if ((players[0].length <= 4) || (players[1].length <= 4)) {
            //         await saveGameOver(true, dispatch)
            //         saveWinStatus((players[1].length <= 4) ? 1 : 0 )
            //         return;
            //     }
            //     if (card1.cardValue > card2.cardValue) {
            //         outputMessage("Player 1 wins");
            //         players[0] = players[0].concat(pot);
            //     }
            //     else if (card1.cardValue < card2.cardValue) {
            //         outputMessage("Player 2 wins");
            //         players[1] = players[1].concat(pot);
            //     } else {
            //         battlemode(pot);
            //         outputMessage("Battle Mode");
            //     }
            // }
    
            function battlemode(pot) {
                var card1, card2;
                var pos = (pot.length / 2);
                if ((players[0].length < 4) || (players[1].length < 4)) {
                    return;
                } else {
                    for (var i = 0; i < 4; i++) {
                        card1 = players[0].shift();
                        pot = pot.concat(card1);
                        p1.innerHTML += showCard(card1, (pos + i));
                    }
                    for (i = 0; i < 4; i++) {
                        card2 = players[1].shift();
                        pot = pot.concat(card2);
                        p2.innerHTML += showCard(card2, (pos + i));
                    }
                    checkWinner(card1, card2, pot);
                }
            }
    
            function showCard(c, p) {
                var move = p * 40;
                //var bgColor = (c.icon == "H" || c.icon == "D") ? "red" : "black";
                var bCard = '<div class="icard ' + c.suit + ' " style="left:' + move + 'px">';
                bCard += '<div class="cardtop suit">' + c.num + '<br></div>';
                bCard += '<div class="cardmid suit"></div>';
                bCard += '<div class="cardbottom suit">' + c.num + '<br></div></div>';
                return bCard;
            }
    
    
            function dealCards(array) {
                for (var i = 0; i < array.length; i++) {
                    var m = i % 2;
                    players[m].push(array[i]);
                }
            }
    


    return (
    <>
        <div id="wrapper">
    <div id="message">Click Fight to Start Game</div>
    <div id="board">
        <div id="player1" className="players">
            <div>SCORE:<span className="score"></span></div>
            <div className="hand" ></div>
        </div>
        <div id="player2" className="players">
            <div>SCORE:<span className="score"></span></div>
            <div className="hand" ></div>
        </div>
        <div id="action">
            {!gameover && <Button  onClick={battle}>Fight</Button>}
        </div>
    </div>
</div>

    </>
  );

}

export default Game;