import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";

const Tabs = () => {
  return (
    <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4'>
      <LinkContainer to="/">
        <Nav.Link>War Card Game</Nav.Link>
      </LinkContainer>
      {/* <LinkContainer to="/admin">
        <Nav.Link>Admin</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/rewards">
        <Nav.Link>Rewards</Nav.Link>
      </LinkContainer> */}
      <LinkContainer to="/testgame">
        <Nav.Link>Test Game</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/testcard">
        <Nav.Link>Test Card</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/testtime">
        <Nav.Link>Test Time</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}

export default Tabs;
