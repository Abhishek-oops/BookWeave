import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo, Footer } from "../components/common";

function PublicLayout({ children }) {
  return <>
    <header className="site-header">
      <Logo />
      <nav className="public-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Browse Books</NavLink>
        <NavLink to="/submit">Submit Your Book</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <Link className="search-link" to="/books">⌕</Link>
    </header>
    {children}
    <Footer />
  </>;
}

export default PublicLayout;
