import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
//import { FormControlLabel, FormGroup, Menu, MenuItem, Switch } from "@mui/material"
//import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import SettingsIcon from "@mui/icons-material/Settings"
import CollectionsIcon from "@mui/icons-material/Folder"
import WebIcon from "@mui/icons-material/Web"
import AutoCollectIcon from "@mui/icons-material/PhotoFilter"
import ImageIcon from "@mui/icons-material/Image"
import InsightsIcon from "@mui/icons-material/Insights"
import StarIcon from "@mui/icons-material/Star"
import PeopleIcon from "@mui/icons-material/People"
import FeedbackIcon from "@mui/icons-material/Feedback"
import HistoryIcon from "@mui/icons-material/History"
import GiftIcon from "@mui/icons-material/Redeem"
import GanttChartIcon from "@mui/icons-material/BarChart"
import { Link, useLocation } from "react-router-dom"
import { useAppSelector } from "../store/hooks"
import { AuthButtons } from "./Header/AuthButtons"
import { MenuLoggedIn } from "./Header/MenuLoggedIn"

const drawerWidth = 250

function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const items = [
    {
      id: 1,
      click() {},
      externalPath: "",
      path: "/",
      name: "Dashboard",
      icon: <HomeIcon />
    },
    {
      id: 2,
      click() {},
      externalPath: "",
      path: "/settings",
      name: "Settings",
      icon: <SettingsIcon />
    },
    {
      id: 3,
      click() {},
      externalPath: "",
      path: "/domains",
      name: "Domains",
      icon: <WebIcon></WebIcon>
    },
    {
      id: 6,
      click() {},
      externalPath: "",
      path: "/gallery",
      name: "Gallery",
      icon: <ImageIcon></ImageIcon>
    },
    {
      id: 26,
      click() {},
      externalPath: "",
      name: "Collections",
      path: "/collections",
      icon: <CollectionsIcon></CollectionsIcon>,
      new: false
    },
    {
      id: 28,
      click() {},
      externalPath: "",
      name: "AutoCollect",
      path: "/autoCollect",
      icon: <AutoCollectIcon></AutoCollectIcon>,
      new: true
    },
    {
      id: 27,
      click() {},
      externalPath: "",
      name: "Insights",
      path: "/insights",
      icon: <InsightsIcon></InsightsIcon>,
      new: false
    },
    {
      id: 31,
      click() {},
      externalPath: "",
      name: "Starred",
      path: "/starred",
      icon: <StarIcon></StarIcon>,
      new: true
    },
    {
      id: 20,
      click() {},
      externalPath: "",
      path: "/users",
      name: "Users",
      icon: <PeopleIcon></PeopleIcon>
    },
    {
      id: 29,
      click() {},
      externalPath: "",
      path: "",
      name: "Provide Feedback",
      icon: <FeedbackIcon></FeedbackIcon>
    },
    {
      id: 30,
      click() {},
      externalPath: "",
      path: "/changelog",
      name: "Changelog & Versions",
      icon: <HistoryIcon></HistoryIcon>
    },
    {
      id: 32,
      click() {},
      externalPath: "",
      path: "",
      name: "Invite a Friend",
      icon: <GiftIcon></GiftIcon>,
      new: true
    },
    {
      id: 33,
      click() {},
      externalPath: "",
      path: "/progress",
      name: "V2 Progress",
      icon: <GanttChartIcon></GanttChartIcon>,
      new: true
    }
  ]

  const location = useLocation()

  const drawer = (
    <div>
      <List>
        {items.map((item) => (
          <ListItem button component={Link} key={item.id} disablePadding to={item.path}>
            <ListItemButton selected={location.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  const username = useAppSelector((state) => state.user.username)

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "nav"
        }}
        color="transparent"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon></MenuIcon>
          </IconButton>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              background: `linear-gradient(#0179f3, #0190ea)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 500,
              flexGrow: 1
            }}
          >
            TPUv2 - React Alpha
          </Typography>
          {username ? <MenuLoggedIn /> : <AuthButtons />}
        </Toolbar>
      </AppBar>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
        }}
        PaperProps={{ sx: { border: "none", backgroundColor: "nav" } }}
        color="nav"
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
        }}
        PaperProps={{ sx: { border: "none", backgroundColor: "nav" } }}
        open
      >
        {drawer}
      </Drawer>
    </div>
  )
}

export default function Header() {
  return (
    <React.Fragment>
      <ResponsiveDrawer />
    </React.Fragment>
  )
}
