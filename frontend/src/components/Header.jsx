import { NavLink } from "react-router-dom";



function Header() {
  
  return (
    <header>
      <div className="logotype">
        <img src="https://www.cinemathequedetanger.com/assets/img/logo-right.svg" alt="" />
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">On now</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
