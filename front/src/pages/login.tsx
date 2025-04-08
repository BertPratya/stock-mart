import React from 'react';
const Login: React.FC = () => {
    return (
        <div style={{
            display: 'flex', // Flex container
            height: '100vh', // Full screen height
        }}>
            {/* Left Section */}
            <div style={{
                flex: 1, // Takes up 50% of the width
                backgroundColor: '#F0F0F0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            </div>

            {/* Right Section */}
            <div style={{
                flex: 1, // Takes up 50% of the width
                backgroundColor: '#FFFFFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            </div>
        </div>
    );
};

export default Login;