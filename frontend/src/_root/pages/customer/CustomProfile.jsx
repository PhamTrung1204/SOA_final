import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LaptopIcon from "@mui/icons-material/Laptop";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ProfileForm from "../../../components/CustomerProfile/ProfileForm";
import FavoritePage from "../../../components/CustomerProfile/FavoritePage";
import SeenProductPage from "../../../components/CustomerProfile/SeenProduct";
import OrderManagementPage from "../../../components/CustomerProfile/OrderManagementPage";

const CustomerProfile = () => {
  const [activeComponent, setActiveComponent] = useState("MyProfile");

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "MyProfile":
        return <ProfileForm />;
      case "Favorite":
        return <FavoritePage />;
      case "SeenProduct":
        return <SeenProductPage />;
      case "OrderManagement":
        return <OrderManagementPage />;
      default:
        return <ProfileForm />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#ffffff",
        color: "#0672cb",
      }}
    >
      {/* Side Menu */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#0672cb",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          <ListItem button onClick={() => handleComponentChange("MyProfile")}>
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="My Profile" sx={{ color: "#ffffff" }} />
          </ListItem>
          <Divider sx={{ backgroundColor: "#ffffff" }} />
          <ListItem button onClick={() => handleComponentChange("Favorite")}>
            <ListItemIcon>
              <LaptopIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Favorite" sx={{ color: "#ffffff" }} />
          </ListItem>
          <Divider sx={{ backgroundColor: "#ffffff" }} />
          <ListItem button onClick={() => handleComponentChange("SeenProduct")}>
            <ListItemIcon>
              <AssignmentTurnedInIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Seen Product" sx={{ color: "#ffffff" }} />
          </ListItem>
          <Divider sx={{ backgroundColor: "#ffffff" }} />
          <ListItem
            button
            onClick={() => handleComponentChange("OrderManagement")}
          >
            <ListItemIcon>
              <PeopleIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText
              primary="Order Management"
              sx={{ color: "#ffffff" }}
            />
          </ListItem>
          <Divider sx={{ backgroundColor: "#ffffff" }} />
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Sign Out" sx={{ color: "#ffffff" }} />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: "40px" }}>
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            backgroundColor: "#ffffff",
            color: "#0672cb",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#0672cb" }}>
            Profile
          </Typography>
          {renderContent()}
        </Paper>
      </Box>
    </Box>
  );
};

export default CustomerProfile;
