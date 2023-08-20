import { Row, Col } from 'react-bootstrap'

import demo from '../wargame_vid.mp4'

const Instructions = () => {
    return (
        <>
            <div className="text-center"><h2>Rules and Instructions</h2></div> <br />
            <h3>Instructions Section:</h3>
            <hr />
            <h5>Environment Setup:</h5>
            <ol>
                <li>In order to play the game, you will need to have a Metamask wallet installed in your browser.</li>
                <li>You will need to connect to the "Sepolia" testnet in order to receive payouts.  You will also need some test Ether and can get some by:</li>
                    <ul>
                        <li>Creating either an Alchemy, Quicknode, or Infura account.</li>
                        <li>Request some test Ether from one of the faucets below by clicking on the link below and then inputting the Sepolia account address from Metamask.</li>
                        <li>After a short delay, the faucet should send you the test Ether and you can then play the game.</li>
                    </ul>
                <li>Once you connect, you will need to import the WARCARDS token at the below token address.  This will allow you to see the token in Metamask.  That same amount is also shown at the top of the game screen.</li>
                <li>You then just need to follow the instructions on the buttons to send tokens to your wallet or withdraw them to use within the game.</li>
            </ol>
            <Row>
                  <Col>
                        <strong className='mx-3' >Sepolia Testnet Ether Faucets</strong>
                        <ul className='ms-3'>
                            <li><a target="_blank" rel='noreferrer' href='https://sepoliafaucet.com'>Alchemy</a></li>
                            <li><a target="_blank" rel='noreferrer' href='https://faucet.quicknode.com/ethereum/sepolia'>QuickNode</a></li>
                            <li><a target="_blank" rel='noreferrer' href='https://www.infura.io/faucet/sepolia'>Infura</a></li>
                        </ul>
                        <strong className='mx-3'>Token Address</strong>
                        <ul className='ms-3'>
                            <li><span className='underline'>WARCARDS: </span>0x53963d192C06c46688beF632929eE5C0f851720a</li>
                        </ul>
                  </Col>
                  <Col>
                    <div className='mb-3' style={{ float: 'right' }}>
                    <h3 className='text-center'><strong>Demo Video</strong></h3>
                    <video controls height={281} width={500} style={{ border: '1px solid black' }}>
                    <source src={demo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>
                  </Col>
            </Row>


            <h3>Rules Section</h3>
            <hr />
            <h4>How to Play the Card Game "War"</h4>
            <br />
            <h5>Game Setup:</h5>
            <ol>
                <li>This game is played with a standard deck of 52 cards, without jokers.</li>
                <li>The deck is automatically shuffled and cards are evenly divided between the "Player" and the "House, so that each player has a stack of 26 cards.</li>
            </ol>

            <h5>Playing the Game:</h5>
            <ol>
                <li>When you click the "Fight" button, the top card of both players is revealed.</li>
                <li>The player with the higher card value (aces are usually high) takes both cards and the cards are placed at the bottom of their deck.</li>
                <li>If both cards have the same value, a "battle" is declared. In a battle:
                    <ul>
                        <li>The top five cards in the deck of each player is shown on the table.</li>
                        <li>The player with the higher first card wins all the cards on the table.</li>
                        <li>If the first cards are of the same value again, the war process is repeated with another set five cards for each player. This process will only be repeated once and if the first cards are still the same, the play will be a draw. If a player runs out of cards during a war, they lose.</li>
                    </ul>
                </li>
                <li>The game continues in this manner, with the player clicking the "Fight" button, the players collecting pairs, and engaging in battles as necessary.</li>
            </ol>

            <h5>Winning the Game:</h5>
            <p>The game is won either by the "Player" or the "House" whichever one that collects all the cards or has the most cards when the timer expires. Due to its luck-based nature, the game can go on for a long time, especially if the players repeatedly go to war.</p>

            <p>Please remember that this is a simple game of chance. There are no decisions or strategies to be made based on the cards themselves.</p>
            <p>There are however strategies that are related to the accumulation of the WARCARDS tokens themselves.</p>
            <h5>WARCARDS Payouts:</h5>
            <ol>
                <li>If you win or lose after the timer expires</li>
                <ul>
                        <li>If you don't bet any of your coins, the payout is 50 WARCARDS.</li>
                        <li>If you bet some of your coins, there is a 2X multiplier.  That means the amount is (whatever you bet + 50 WARCARDS) X 2</li>
                </ul>
                <li>If you win or lose before the timer expires:
                    <ul>
                        <li>If you don't bet any of your coins, the payout is 100 WARCARDS.</li>
                        <li>If you bet some of your coins, there is a 2X multiplier.  That means the amount is (whatever you bet + 100 WARCARDS) X 2</li>
                    </ul>
                </li>
            </ol>

        </>
    )
}

export default Instructions;