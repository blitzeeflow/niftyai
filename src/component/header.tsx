import {
  Navbar,
  NavbarBrand,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
} from "reactstrap";

import { useState } from "react";
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <Navbar color="warning">
      <NavbarBrand href="/">Nifty AI</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink href="/summarise/">Summarise</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/chat/">Chat</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};
