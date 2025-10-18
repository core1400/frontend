import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import coreLogo from "../../assets/core-logo-navbar.jpg";
import type {Role} from "../../utils/types/navbar.types";
import { pages } from "../../utils/config/pages.config";

const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="26"
    viewBox="0 96 960 960"
    width="26"
    aria-hidden="true"
  >
    <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"></path>
  </svg>
);

const MenuIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="26"
    viewBox="0 96 960 960"
    width="26"
    aria-hidden="true"
  >
    <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"></path>
  </svg>
);

const SignOutIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M16 13v-2H7V8l-5 4l5 4v-3h9Zm3-10H11a2 2 0 0 0-2 2v3h2V5h8v14h-8v-3H9v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
    />
  </svg>
);

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // dummy server data — replace when API is ready
  const name: string = "אור שביט מליבוב";
  const misparIshi: string = "123456789";
  const role: Role = "מפקד";

  const { greeting } = useMemo<{ greeting: string }>(() => {
    const now = new Date();
    const hour: number = now.getHours();

    let g: string = "בוקר טוב";
    if (hour >= 12 && hour <= 15) g = "צהריים טובים";
    else if (hour >= 16 && hour <= 20) g = "ערב טוב";
    else if (hour >= 21 || hour <= 4) g = "לילה טוב";
    return { greeting: `${g}, ${name}` };
  }, [name]);

  // lock background scroll when sidebar is open
  useEffect(() => {
    const original: string = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close the sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const visiblePages = pages.filter((p) => p.roles.includes(role));


  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul
        id="mobile-menu"
        className={`${styles.sidebar} ${open ? styles.open : ""}`}
        role="menu"
        aria-hidden={!open}
      >
        <li>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </button>
        </li>

        {visiblePages.map((page) => (
          <li key={page.id}>
            <NavLink
              to={page.path}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              {page.label}
            </NavLink>
          </li>
        ))}

        <li className={styles.sidebarDivider} aria-hidden="true"></li>

        <li>
          <button
            type="button"
            className={styles.signOutBtn}
            aria-label="Sign out"
            onClick={() => navigate("/login")}
          >
            <SignOutIcon />
            <span>יציאה</span>
          </button>
        </li>
      </ul>

      {/* Top bar */}
      <ul className={styles.mainList}>
        <li className={styles.menuButton}>
          <button
            type="button"
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={styles.iconButton}
          >
            <MenuIcon />
          </button>
        </li>

        <li className={styles.item}><span>{greeting}</span></li>
        <li className={styles.item}><span>מ.א: {misparIshi}</span></li>
        <li className={`${styles.item} ${styles.role}`}><strong>{role}</strong></li>
        <li className={styles.brandLeft}>
          <NavLink to="/home" className={styles.brandBtn} aria-label="לדף הבית">
            <img src={coreLogo} alt="CORE logo" className={styles.brandImg} />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
