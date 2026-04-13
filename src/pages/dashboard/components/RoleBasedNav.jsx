import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  Upload,
  CheckCircle,
  Users,
  Eye,
  LineChart,
  Wallet,
  FolderOpen,
  ClipboardList,
  ShieldAlert,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Bookmark,
  History,
} from "lucide-react";

const PRIMARY_COLOR = "#61C5C3";
const TOKEN_KEY = "dali-token";
const USER_KEY = "dali-user";

const ROLE_NAV_ITEMS = {
  buyer: [
    { label: "Browse Datasets", path: "/dashboard/buyer", icon: Eye, section: "browse" },
    { label: "My Purchases", path: "/dashboard/buyer", icon: ShoppingCart, section: "purchases" },
    { label: "Download History", path: "/dashboard/buyer", icon: FolderOpen, section: "downloads" },
    { label: "Purchase Stats", path: "/dashboard/buyer", icon: LineChart, section: "stats" },
  ],
  seller: [
    { label: "My Datasets", path: "/dashboard/seller", icon: Upload, section: "datasets" },
    { label: "Upload Dataset", path: "/dashboard/seller", icon: FolderOpen, section: "upload" },
    { label: "Sales Analytics", path: "/dashboard/seller", icon: BarChart3, section: "sales" },
    { label: "Earnings", path: "/dashboard/seller", icon: Wallet, section: "earnings" },
  ],
  editor: [
    { label: "Content Review", path: "/dashboard/editor", icon: ClipboardList, section: "review" },
    { label: "Quality Checks", path: "/dashboard/editor", icon: CheckCircle, section: "quality" },
    { label: "Approval History", path: "/dashboard/editor", icon: FolderOpen, section: "history" },
    { label: "Notifications", path: "/dashboard/editor", icon: Bell, section: "alerts" },
  ],
  admin: [
    { label: "Browse Datasets", path: "/dashboard/admin", icon: Eye, section: "browse" },
    { label: "Saved Collections", path: "/dashboard/admin", icon: Bookmark, section: "saved" },
    { label: "Viewing History", path: "/dashboard/admin", icon: History, section: "history" },
    { label: "User Management", path: "/dashboard/admin", icon: Users, section: "users" },
    { label: "Content Moderation", path: "/dashboard/admin", icon: ShieldAlert, section: "moderation" },
    { label: "Platform Reports", path: "/dashboard/admin", icon: BarChart3, section: "reports" },
    { label: "System Settings", path: "/dashboard/admin", icon: Settings, section: "settings" },
  ],
  super_admin: [
    { label: "Browse Datasets", path: "/dashboard/admin", icon: Eye, section: "browse" },
    { label: "Saved Collections", path: "/dashboard/admin", icon: Bookmark, section: "saved" },
    { label: "Viewing History", path: "/dashboard/admin", icon: History, section: "history" },
    { label: "User Management", path: "/dashboard/admin", icon: Users, section: "users" },
    { label: "Content Moderation", path: "/dashboard/admin", icon: ShieldAlert, section: "moderation" },
    { label: "Platform Reports", path: "/dashboard/admin", icon: BarChart3, section: "reports" },
    { label: "System Settings", path: "/dashboard/admin", icon: Settings, section: "settings" },
  ],
  viewer: [
    { label: "Browse Datasets", path: "/dashboard/viewer", icon: Eye, section: "browse" },
    { label: "Saved Collections", path: "/dashboard/viewer", icon: FolderOpen, section: "saved" },
    { label: "Viewing History", path: "/dashboard/viewer", icon: ClipboardList, section: "history" },
    { label: "Platform Insights", path: "/dashboard/viewer", icon: LineChart, section: "insights" },
  ],
};

export default function RoleBasedNav({ currentPath }) {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSection, setSelectedSection] = useState(
    () => localStorage.getItem("dali-dashboard-section") || ""
  );

  useEffect(() => {
    loadAuthUser();
  }, []);

  const loadAuthUser = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token && user) {
      try {
        setAuthUser(JSON.parse(user));
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  };

  const normalizedRole = authUser?.role?.toLowerCase();
  const userRole = normalizedRole === "superadmin" ? "super_admin" : normalizedRole || "viewer";
  const navItemsRaw = ROLE_NAV_ITEMS[userRole] || ROLE_NAV_ITEMS.viewer;
  const navItems = navItemsRaw.filter((item, index, arr) => {
    const key = `${item.path}-${item.section}-${item.label}`;
    return arr.findIndex((candidate) => `${candidate.path}-${candidate.section}-${candidate.label}` === key) === index;
  });

  useEffect(() => {
    const effectiveSection = selectedSection || navItems[0]?.section;
    const hasSection = navItems.some((item) => item.section === effectiveSection);
    if (!hasSection && navItems[0]?.section) {
      setSelectedSection(navItems[0].section);
      localStorage.setItem("dali-dashboard-section", navItems[0].section);
    }
  }, [navItems, selectedSection]);

  const handleRoleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRoleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path, section) => {
    if (section) {
      localStorage.setItem("dali-dashboard-section", section);
      setSelectedSection(section);
      window.dispatchEvent(new CustomEvent("dashboard:section", { detail: section }));
    }
    navigate(path);
    handleRoleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth:updated"));
    navigate("/login");
  };

  const getInitials = () => {
    if (!authUser?.name) return "U";
    return authUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #eee",
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* User Info Section */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
            cursor: "pointer",
          }}
          onClick={handleRoleClick}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: PRIMARY_COLOR,
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {getInitials()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {authUser?.name || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: PRIMARY_COLOR,
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {userRole}
            </Typography>
          </Box>
          <ChevronDown size={18} color="gray" />
        </Box>

        {/* Role Switcher Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleRoleClose}
        >
          {Object.entries(ROLE_NAV_ITEMS).map(([role, items]) => (
            <MenuItem
              key={role}
              onClick={() => {
                if (items[0]) {
                  handleNavigate(items[0].path, items[0].section);
                }
              }}
              sx={{ textTransform: "capitalize" }}
            >
              {role}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const effectiveSection = selectedSection || navItems[0]?.section;
          const isActive = currentPath === item.path && item.section === effectiveSection;

          return (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigate(item.path, item.section)}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                backgroundColor: isActive ? `${PRIMARY_COLOR}20` : "transparent",
                borderLeft: isActive ? `4px solid ${PRIMARY_COLOR}` : "4px solid transparent",
                pl: 1.25,
                "&:hover": {
                  backgroundColor: `${PRIMARY_COLOR}10`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive ? PRIMARY_COLOR : "gray",
                }}
              >
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? PRIMARY_COLOR : "#333",
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Menu Items */}
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem
          button
          onClick={() => navigate("/profile")}
          sx={{
            p: 1.5,
            mb: 1,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "gray" }}>
            <Settings size={20} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem
          button
          sx={{
            p: 1.5,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
          onClick={handleLogout}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "#ef4444" }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: "#ef4444" }} />
        </ListItem>
      </List>
    </Box>
  );
}
