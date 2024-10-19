import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function CustomNavBar() {
  return (
    <Navbar>
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="main-topnav">
            <Nav.Link href="/catalog">Catalogo</Nav.Link>
            <Nav.Link href="#Rental">Alquiler</Nav.Link>
            <Nav.Link href="#Tutorials">Tutoriales</Nav.Link>
            <Nav.Link href="#About us">Quienes somos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavBar;