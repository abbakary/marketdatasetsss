import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Typography, Button, IconButton, List, ListItem, ListItemText, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Settings, LogOut } from "lucide-react";
import PageLayout from "../public/components/PageLayout";

const TOKEN_KEY = "dali-token";
const USER_KEY = "dali-user";

export default function UserProfile() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    loadAuthUser();
  }, []);

  const loadAuthUser = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setAuthUser(userData);
        setPhoneInput(userData.phone || "");
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
  };

  const handleEditPhoneOpen = () => {
    setEditPhoneOpen(true);
  };

  const handleEditPhoneClose = () => {
    setEditPhoneOpen(false);
  };

  const handleSavePhone = () => {
    if (authUser) {
      const updatedUser = { ...authUser, phone: phoneInput };
      setAuthUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      handleEditPhoneClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth:updated"));
    navigate("/login");
  };

  const menuItems = [
    { label: "Make money", id: "make-money" },
    { label: "Followers", id: "followers" },
    { label: "My adverts", id: "my-adverts" },
    { label: "Feedback", id: "feedback" },
    { label: "Frequently Asked Questions", id: "faq" },
  ];

  const getInitials = () => {
    if (!authUser?.name) return "U";
    return authUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <PageLayout>
      <Box sx={{ p: 3, background: "#dce6f0", minHeight: "calc(100vh - 64px)", display: "flex", gap: 2 }}>
        <Paper sx={{ width: 260, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton size="small"><Settings size={18} /></IconButton>
          </Box>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar sx={{ width: 84, height: 84, mx: "auto", mb: 1, bgcolor: "#a5d6a7" }}>{getInitials()}</Avatar>
            <Typography sx={{ fontWeight: 700 }}>{authUser?.name || "User"}</Typography>
            <Button size="small" onClick={handleEditPhoneOpen}>ADD PHONE NUMBER</Button>
          </Box>
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => (
              <ListItem key={item.id} button sx={{ borderTop: "1px solid #f1f5f9" }}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        
        </Paper>

        <Paper sx={{ flex: 1, p: 3, minHeight: 420 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>My adverts</Typography>
          <Box sx={{ borderTop: "1px solid #e5e7eb", mt: 1, pt: 10, textAlign: "center", color: "#6b7280" }}>
            <Typography>There are no adverts yet. Create new one now!</Typography>
            <Button variant="contained" sx={{ mt: 2, textTransform: "none" }} onClick={() => navigate("/sell")}>Create advert</Button>
          </Box>
        </Paper>
      </Box>
      
      <Dialog open={editPhoneOpen} onClose={handleEditPhoneClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Phone Number</DialogTitle>
        <DialogContent>
          <TextField
            label="Phone Number"
            type="tel"
            fullWidth
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditPhoneClose}>Cancel</Button>
          <Button onClick={handleSavePhone} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
