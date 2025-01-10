import React, { createContext, useState, useContext, use } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (loginResponse) => {

        if(!loginResponse?.token) {
            console.error('Invalid login response:', loginResponse);
            return;
        }
        console.log('Storing user in context:', loginResponse); // Debugging
    
        // Fetch user details using the token
        try {
            const response = await fetch('http://localhost:4000/auth/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${loginResponse.token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text(); // Read response as text
                console.error('Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userDetails = await response.json();
    
            if (response.ok) {
                setUser({ ...userDetails, token: loginResponse.token });
            } else {
                console.error('Error fetching user details:', userDetails.error);
            }
        } catch (error) {
            console.error('Error during fetching user details:', error);
        }
    };
    

    const logout = () => {
        setUser(null); // Clear user data
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
