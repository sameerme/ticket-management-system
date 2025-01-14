import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LeftPanel = () => {
    const { user } = useAuth();

    const getMenuItems = () => {
        const menuItems = [
            { name: "Dashboard", path: "/dashboard" }, // Common for all users
        ];

        // Add role-based menus
        if (user?.role === "content_producer") {
            menuItems.push({ name: "Create Ticket", path: "/create-ticket" });
        }

        if (user?.role === "admin") {
            menuItems.push({ name: "Add User", path: "/adduser" });
        }

        return menuItems;
    };

    const menuItems = getMenuItems();

    return (
        <Box
            sx={{
                width: "200px",
                height: "100vh",
                backgroundColor: "#1565c0", // Blue color
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                position: "fixed",
                top: 0,
                left: 0,
            }}
        >
            <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: "bold", textAlign: "center" }}
            >
                My App
            </Typography>
            <List sx={{ width: "100%" }}>
                {menuItems.map((menu) => (
                    <ListItem
                        button
                        key={menu.name}
                        component={Link}
                        to={menu.path}
                        sx={{
                            "&:hover": { 
                                backgroundColor: "#1e88e5", 
                                borderRadius: "8px" 
                            },
                            color: "#fff",
                            marginBottom: 1,
                            borderRadius: "8px", // Ensures rounded corners even without hover
                        }}
                    >
                        <ListItemText primary={menu.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default LeftPanel;
