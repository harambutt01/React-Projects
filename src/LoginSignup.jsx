import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

export default function LoginSignup() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/login' : '/api/signup';
        try {
            const response = await axios.post(`http://localhost:4000${endpoint}`, formData);
            
            if (response.data.status === "Success") {
                toast.success(isLogin ? "Welcome Back to Trendora!" : "Account Created Successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });

                // --- LOGIC: User data save karna aur Navbar ko signal bhejna ---
                const userData = response.data.user;
                const userRole = userData.role || 'customer'; 
                
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('userRole', userRole); 
                
                // Navbar ko update karne ka signal
                window.dispatchEvent(new Event("authChange"));

                // Redirect logic
                if (userRole === 'admin') {
                    navigate('/admin'); 
                } else {
                    navigate('/'); // User ko home page par bhej rahe hain
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Authentication Failed. Please try again!", {
                theme: "colored"
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#222', fontWeight: 'bold' }}>
                    {isLogin ? 'Login to Trendora' : 'Join Our Community'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>Full Name</label>
                            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        </div>
                    )}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>Email Address</label>
                        <input type="email" name="email" placeholder="example@test.com" onChange={handleChange} required 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>Password</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                    </div>
                    
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00bcd4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        {isLogin ? 'LOG IN' : 'SIGN UP'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#00bcd4', fontWeight: '500' }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "New to Trendora? Create Account" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
}