import { Link } from 'react-router-dom';
import { Nav, Navbar, Button } from 'react-bootstrap';

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">
              blogs
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">
              users
            </Link>
          </Nav.Link>

          <Nav.Link href="#" as="span">
            {user ? (
              <>
                <em style={padding}>{user.name} logged in</em>{' '}
                <Button variant="secondary" onClick={handleLogout}>
                  logout
                </Button>
              </>
            ) : (
              <></>
            )}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
