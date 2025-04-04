import React, { useContext, useEffect, useState } from "react";
import styles from "./Header.module.scss";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../../providers/AuthProvider";
import { Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { logout, user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setAnchorEl(null);
  };

  useEffect(() => {
    if (user === null) {
      navigate("/auth");
    }
  }, [user]);

  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <Link to={"/"}>
          <img src="/logo.png" className={styles.logo} alt="logo" />
        </Link>
        <IconButton color="inherit" onClick={handleMenu}>
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
