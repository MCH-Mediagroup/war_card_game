import Table from 'react-bootstrap/Table';

const Cards = ( {cards, count} ) => {
    console.log(count)
    return (
        <>
        <div>
        <h2>Cards Data...</h2>
        <Table striped bordered hover responsive>
        <thead>
            <tr>
              <th>Id</th>
              <th>Card Name</th>
              <th>Suit</th>
            </tr>
          </thead>
          <tbody>
          {cards.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.cardName}</td>
              <td>{card.suit}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h3>Total Cards...</h3>
        </div>
        <div>{count}</div>
        </>
      );
    
}

export default Cards;