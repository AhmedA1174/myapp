import React from 'react';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <img src="/assets/logo.png" alt="PolicyGuard Logo" className="logo"/>
                <nav>
                    {/* Add navigation links if any */}
                </nav>
                <div>
                    <button className="login-btn">Login</button>
                    <button className="signup-btn">Signup</button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>Welcome to PolicyGuard</h1>
                    <p>Your ultimate solution for managing policies.</p>
                    <div>
                        <button className="signup-btn">Get Started</button>
                        <button className="login-btn">Login</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/assets/hero-image.png" alt="PolicyGuard Illustration"/>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature">
                    <img src="/assets/feature1-icon.png" alt="Feature 1"/>
                    <h3>Feature 1</h3>
                    <p>Description for feature 1.</p>
                </div>
                {/* Repeat for other features... */}
            </section>

            {/* Footer */}
            <footer className="home-footer">
                {/* Add footer content */}
                <p>&copy; 2023 PolicyGuard</p>
            </footer>
        </div>
    );
}

export default Home;
