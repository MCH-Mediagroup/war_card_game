const Instructions = () => {
    return (
        <>
            <div className="text-center"><h2>Rules and Instructions</h2></div> <br />
            <h3>Instructions Section:</h3>
            <hr />
            <br />
            <h3>Rules Section</h3>
            <hr />
            <h4>How to Play the Card Game "War"</h4>
            <br />
            <h5>Setup:</h5>
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
            <p>Here are some of them:</p>
        </>
    )
}

export default Instructions;