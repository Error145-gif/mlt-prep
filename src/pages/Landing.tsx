<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MLT Prep - Medical Lab Technician Exam App</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
            --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --cta-gradient: linear-gradient(135deg, #FF512F 0%, #DD2476 100%);
            --text-main: #ffffff;
            --text-muted: rgba(255, 255, 255, 0.8);
            --radius: 20px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: #1a1a2e;
            color: var(--text-main);
            overflow-x: hidden;
            min-height: 100vh;
            position: relative;
        }

        /* Dynamic Background with Gradient Overlay & Noise */
        .bg-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: 
                linear-gradient(135deg, rgba(76, 29, 149, 0.6), rgba(30, 64, 175, 0.6), rgba(219, 39, 119, 0.6)),
                url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop') no-repeat center center/cover;
        }

        .bg-wrapper::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            pointer-events: none;
        }

        /* Glassmorphism Utility Class */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius);
            box-shadow: var(--glass-shadow);
            padding: 24px;
        }

        .container {
            max-width: 480px; /* Mobile-first limit */
            margin: 0 auto;
            padding: 20px;
        }

        /* Text Styles */
        h1 { font-size: 28px; line-height: 1.3; margin-bottom: 15px; font-weight: 700; }
        h2 { font-size: 24px; margin-bottom: 20px; font-weight: 600; text-align: center; }
        h3 { font-size: 18px; margin-bottom: 10px; font-weight: 600; }
        p { font-size: 14px; line-height: 1.6; color: var(--text-muted); }
        
        /* Hero Section */
        .hero {
            text-align: center;
            padding-top: 40px;
            padding-bottom: 40px;
        }

        .badge-pill {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stats-row {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 25px 0;
            flex-wrap: wrap;
        }

        .stat-item {
            text-align: center;
            background: rgba(0,0,0,0.2);
            padding: 8px 12px;
            border-radius: 12px;
        }

        .stat-val { font-weight: 700; font-size: 14px; display: block; }
        .stat-lbl { font-size: 10px; opacity: 0.8; }

        /* Offer Card */
        .offer-card {
            margin: 30px 0;
            border: 1px solid rgba(255, 165, 0, 0.5);
            box-shadow: 0 0 15px rgba(255, 165, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .most-popular-tag {
            background: linear-gradient(to right, #FF512F, #DD2476);
            position: absolute;
            top: 0;
            right: 0;
            padding: 5px 15px;
            font-size: 10px;
            font-weight: 700;
            border-bottom-left-radius: 15px;
        }

        .price-large { font-size: 32px; font-weight: 700; color: #fff; }
        .save-badge { background: #10B981; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 10px; font-weight: 600; }
        .val-highlight { color: #FFD700; font-weight: 600; font-size: 13px; margin-top: 5px; display: block; }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 16px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            color: white;
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin-top: 15px;
        }

        .btn:active { transform: scale(0.98); }
        
        .btn-primary {
            background: var(--primary-gradient);
            box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
        }

        .btn-cta {
            background: var(--cta-gradient);
            box-shadow: 0 4px 15px rgba(221, 36, 118, 0.4);
        }

        .btn i { margin-left: 10px; }

        .trust-text {
            margin-top: 15px;
            font-size: 11px;
            opacity: 0.7;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        /* Feature Section */
        .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin: 40px 0;
        }

        .feature-card {
            display: flex;
            align-items: center;
            gap: 20px;
            transition: transform 0.3s ease;
        }

        .feature-card:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .icon-box {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #a78bfa;
            flex-shrink: 0;
        }

        /* Pricing Section */
        .pricing-section { margin: 50px 0; }
        
        .plan-card {
            margin-bottom: 25px;
            position: relative;
        }

        .plan-card ul {
            list-style: none;
            margin: 20px 0;
            text-align: left;
        }

        .plan-card li {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            font-size: 14px;
        }

        .plan-card li i { margin-right: 12px; width: 16px; }
        .fa-check { color: #10B981; }
        .fa-xmark { color: #EF4444; }

        .premium-card {
            border: 2px solid rgba(124, 58, 237, 0.5);
            background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
        }

        .gold-badge {
            background: linear-gradient(to right, #F2994A, #F2C94C);
            color: #000;
            font-weight: 700;
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 10px;
        }

        /* CTA Section */
        .cta-box {
            text-align: center;
            margin-bottom: 60px;
            border: 1px solid rgba(255,255,255,0.3);
        }

        /* Footer */
        footer {
            border-top: 1px solid var(--glass-border);
            padding: 40px 20px 20px;
            background: rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            max-width: 480px;
            margin: 0 auto;
            text-align: left;
        }

        .footer-col h4 {
            font-size: 16px;
            margin-bottom: 15px;
            color: #fff;
        }

        .footer-col ul { list-style: none; }
        .footer-col li { margin-bottom: 8px; }
        .footer-col a { color: var(--text-muted); text-decoration: none; font-size: 13px; transition: color 0.2s; }
        .footer-col a:hover { color: #fff; }

        .copyright {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            opacity: 0.5;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        /* Desktop responsiveness helper */
        @media (min-width: 768px) {
            .container, .footer-grid { max-width: 900px; }
            .features-grid { grid-template-columns: 1fr 1fr; }
            .pricing-wrapper { display: flex; gap: 20px; justify-content: center; align-items: stretch; }
            .plan-card { flex: 1; }
            .footer-grid { grid-template-columns: repeat(3, 1fr); }
            h1 { font-size: 42px; }
        }
    </style>
</head>
<body>

    <div class="bg-wrapper"></div>

    <div class="container">
        
        <header class="hero">
            <div class="badge-pill">AI-Powered Medical Lab Technology Learning</div>
            
            <h1>Medical Lab Technician (MLT) Exam Preparation with AI-Powered Mock Tests & PYQs</h1>
            
            <p style="font-size: 16px;">Complete preparation for DMLT, BMLT and Government Lab Technician Exams</p>

            <div class="stats-row">
                <div class="stat-item">
                    <span class="stat-val">250+</span>
                    <span class="stat-lbl">Active Students</span>
                </div>
                <div class="stat-item">
                    <span class="stat-val">5000+</span>
                    <span class="stat-lbl">Questions</span>
                </div>
                <div class="stat-item">
                    <span class="stat-val">95%</span>
                    <span class="stat-lbl">Success Rate</span>
                </div>
            </div>

            <div class="glass-card offer-card">
                <div class="most-popular-tag">MOST POPULAR</div>
                <h3>Exam Success Pack</h3>
                <div style="margin: 10px 0;">
                    <span class="price-large">₹399</span>
                    <span style="opacity: 0.8; font-size: 14px;"> / 4 Months</span>
                    <span class="save-badge">SAVE ₹97</span>
                </div>
                <span class="val-highlight">Best Value @ ₹99/month</span>
                
                <a href="#" class="btn btn-primary">
                    Go To Dashboard <i class="fas fa-arrow-right"></i>
                </a>

                <div class="trust-text">
                    <span><i class="fas fa-lock" style="font-size: 9px;"></i> No credit card required • Cancel anytime</span>
                    <span><i class="fas fa-shield-alt" style="font-size: 9px;"></i> 100% Money-back guarantee</span>
                </div>
            </div>
        </header>

        <section>
            <div class="features-grid">
                <div class="glass-card feature-card">
                    <div class="icon-box"><i class="fas fa-brain"></i></div>
                    <div>
                        <h3>AI-Powered Questions</h3>
                        <p>Smart AI generated MCQs tailored to the latest MLT pattern.</p>
                    </div>
                </div>

                <div class="glass-card feature-card">
                    <div class="icon-box"><i class="fas fa-book-medical"></i></div>
                    <div>
                        <h3>Medical Lab PYQs</h3>
                        <p>Comprehensive database of Previous Year Question papers.</p>
                    </div>
                </div>

                <div class="glass-card feature-card">
                    <div class="icon-box"><i class="fas fa-certificate"></i></div>
                    <div>
                        <h3>MLT Mock Tests</h3>
                        <p>Full-length timed mock tests to simulate exam environment.</p>
                    </div>
                </div>

                <div class="glass-card feature-card">
                    <div class="icon-box"><i class="fas fa-chart-line"></i></div>
                    <div>
                        <h3>Track Progress</h3>
                        <p>Detailed performance analytics to identify weak areas.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="pricing-section">
            <h2>Why Upgrade to Premium?</h2>
            
            <div class="pricing-wrapper">
                <div class="glass-card plan-card">
                    <h3>Starter Free</h3>
                    <p>Basic preparation</p>
                    <ul>
                        <li><i class="fas fa-check"></i> 1 Mock Test</li>
                        <li><i class="fas fa-check"></i> 1 PYQ Set</li>
                        <li><i class="fas fa-check"></i> 1 AI Practice Session</li>
                        <li><i class="fas fa-xmark" style="opacity: 0.5;"></i> Detailed Analytics</li>
                        <li><i class="fas fa-xmark" style="opacity: 0.5;"></i> Rank & Leaderboard</li>
                    </ul>
                </div>

                <div class="glass-card plan-card premium-card">
                    <div class="gold-badge"><i class="fas fa-star"></i> MOST POPULAR</div>
                    <h3>Premium Access</h3>
                    <div style="margin-bottom: 10px;">
                        <span style="font-size: 24px; font-weight: 700;">₹399</span>
                        <span style="font-size: 13px; opacity: 0.8;"> / 4 months</span>
                    </div>
                    <ul>
                        <li><i class="fas fa-check"></i> Unlimited Mock Tests</li>
                        <li><i class="fas fa-check"></i> Unlimited PYQs</li>
                        <li><i class="fas fa-check"></i> Unlimited AI Practice</li>
                        <li><i class="fas fa-check"></i> Detailed Analytics</li>
                        <li><i class="fas fa-check"></i> Rank & Leaderboard</li>
                        <li><i class="fas fa-check"></i> Weak Area Analysis</li>
                    </ul>
                    <a href="#" class="btn btn-cta">
                        Upgrade Now - Save ₹97 <i class="fas fa-bolt"></i>
                    </a>
                </div>
            </div>
        </section>

        <section class="cta-section">
            <div class="glass-card cta-box">
                <h2>Ready to Start Your Journey?</h2>
                <p style="margin-bottom: 20px; font-size: 16px;">Join thousands of students preparing smarter for their Lab Technician exams.</p>
                <a href="#" class="btn btn-primary" style="max-width: 250px;">
                    Get Started Free
                </a>
            </div>
        </section>

    </div>

    <footer>
        <div class="footer-grid">
            <div class="footer-col">
                <h4 style="color: #a78bfa; font-weight: 700; font-size: 20px;">MLT Prep</h4>
                <p>The smartest way to prepare for Medical Lab Technician exams in India. AI-driven learning for better results.</p>
            </div>
            <div class="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Medical Lab Exam</h4>
                <ul>
                    <li><a href="#">MLT Exam Pattern</a></li>
                    <li><a href="#">Lab Technician Syllabus</a></li>
                    <li><a href="#">DMLT Course Info</a></li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            © 2024 MLT Prep All Rights Reserved
        </div>
    </footer>

</body>
</html>
