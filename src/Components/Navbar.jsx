import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ThemeToggle from "./ThemeToggle";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { NEWS_CATEGORIES } from "../constants/categories";

export default function Navbar({ darkMode, setDarkMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          component={Link}
          to="/"
          variant="h5"
          sx={{ color: "inherit", flexGrow: 1, textDecoration: "none" }}
        >
          NewsArea
        </Typography>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          {NEWS_CATEGORIES.map((item) => (
            <Button
              key={item.category}
              color="inherit"
              component={Link}
              to={item.path}
            >
              {item.label}
            </Button>
          ))}
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <IconButton
            aria-label="Open navigation menu"
            color="inherit"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {NEWS_CATEGORIES.map((item) => (
              <MenuItem
                key={item.category}
                component={Link}
                to={item.path}
                onClick={handleClose}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
