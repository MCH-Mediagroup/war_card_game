import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";

const Tabs = () => {
  return (
    <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4'>
      <LinkContainer to="/">
        <Nav.Link>War Card Game</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/instructions">
        <Nav.Link>Rules and Instructions</Nav.Link>
      </LinkContainer>
      {/* <LinkContainer to="/admin">
        <Nav.Link>Admin</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/rewards">
        <Nav.Link>Rewards</Nav.Link>
      </LinkContainer> */}
    </Nav>
  );
}

export default Tabs;
