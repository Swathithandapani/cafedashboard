import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const adminEmail = 'admin@smartcafe.com';
  const adminPassword = 'admin123';

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      alert('Login Successful!');
      setErrorMsg('');
      navigate('/dash');
    } else {
      setErrorMsg('Invalid email or password.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={{ ...styles.form, ...responsive.form }}>
        <h2 style={{ ...styles.title, ...responsive.title }}>☕ Smart Café Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ ...styles.input, ...responsive.input }}
        />

        <div style={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, paddingRight: '40px', ...responsive.input }}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" onClick={handleLogin} style={{ ...styles.button, ...responsive.button }}>
          Login
        </button>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    backgroundImage: `url('https://images.unsplash.com/photo-1481833761820-0509d3217039?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FmZSUyMHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '10px',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  form: {
    position: 'relative',
    zIndex: 2,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '40px 35px',
    borderRadius: '15px',
    width: '350px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '22px',
    color: '#ffffff',
    textShadow: '0 0 5px rgba(0,0,0,0.6)',
  },
  input: {
    width: '93%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    outline: 'none',
  },
  passwordContainer: {
    position: 'relative',
    width: '92%',
  },
  eyeIcon: {
    position: 'absolute',
    top: '43%',
    right: '-20px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#444',
    fontSize: '18px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff5722',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.3s ease',
  },
  error: {
    marginTop: '15px',
    color: 'red',
    fontWeight: 'bold',
  },
};

// Mobile responsive tweaks
const responsive = window.innerWidth < 480 ? {
  form: {
    width: '95%',
    padding: '30px 20px',
  },
  title: {
    fontSize: '18px',
  },
  input: {
    fontSize: '14px',
    padding: '10px',
  },
  button: {
    fontSize: '14px',
    padding: '10px',
  },
} : {};

export default Login;
