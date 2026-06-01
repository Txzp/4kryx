<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>4KRYX | Developer & Creator</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

    <!-- FONDO BLANCO Y NEGRO (MITAD Y MITAD) -->
    <div class="half-half-background"></div>
    
    <!-- BOLITAS ANIMADAS -->
    <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>

    <header class="topbar" id="topbar">
        <nav class="nav-buttons">
            <button data-target="home" class="active">🏠 Home</button>
            <button data-target="about">👤 About</button>
            <button data-target="projects">🚀 Projects</button>
        </nav>
    </header>

    <main>
        <!-- SECCIÓN HOME -->
        <section id="home" class="section home-section">
            <div class="home-content">
                <p class="intro-label glitch-text" data-text="✦ 4KRYX ✦">✦ 4KRYX ✦</p>
                <h1 class="main-title">
                    <span class="typing-text-full">DEVELOPER & CREATOR</span>
                </h1>
                <p class="description">I build things: <span class="rotating-text">Games</span><span class="cursor">|</span></p>
                
                <!-- SOLO 3 REDES SOCIALES -->
                <div class="social-links">
                    <a href="#" class="social-link discord">
                        <i class="fab fa-discord"></i>
                        <span>4kryx</span>
                    </a>
                    <a href="https://www.roblox.com/es/users/8677588088/profile" target="_blank" class="social-link roblox">
                        <i class="fab fa-roblox"></i>
                        <span>Roblox</span>
                    </a>
                    <a href="https://guns.lol/fxhtz" target="_blank" class="social-link guns">
                        <i class="fas fa-crosshairs"></i>
                        <span>guns.lol</span>
                    </a>
                </div>
                
                <button class="cta-button" id="exploreBtn">
                    <span>EXPLORE MY WORK</span>
                    <i class="fas fa-arrow-down"></i>
                </button>
            </div>
        </section>

        <!-- SECCIÓN ABOUT - NUEVO DISEÑO 50%/50% -->
        <section id="about" class="section about-section">
            <div class="about-container">
                <!-- LADO IZQUIERDO: TEXTO -->
                <div class="about-left">
                    <p class="section-label">▸ about me</p>
                    <h1 class="about-name">4kryx</h1>
                    <h2 class="about-title">Full Stack Developer & Roblox Creator</h2>
                    <p class="about-description">Building tools, experiences and innovative projects with Roblox, React, Lua and modern web technologies.</p>
                    
                    <div class="about-buttons">
                        <button class="about-btn primary" id="viewProjectsBtn">View Projects</button>
                        <button class="about-btn secondary" id="contactMeBtn">Contact Me</button>
                    </div>
                    
                    <!-- Tecnologías en grid -->
                    <div class="skills-grid">
                        <div class="skill-card">C++</div>
                        <div class="skill-card">LUA</div>
                        <div class="skill-card">JS</div>
                        <div class="skill-card">Py</div>
                        <div class="skill-card">CSS</div>
                        <div class="skill-card">React</div>
                    </div>
                </div>
                
                <!-- LADO DERECHO: IMAGEN + TARJETA -->
                <div class="about-right">
                    <div class="image-card">
                        <div class="image-glow"></div>
                        <img src="https://i.pinimg.com/736x/36/09/3a/36093afd7e2a447c0ee6e34468be4582.jpg" alt="4kryx" class="profile-image">
                        <div class="image-info">
                            <div class="info-line">
                                <i class="fas fa-code"></i>
                                <span>Roblox Creator</span>
                            </div>
                            <div class="info-line">
                                <i class="fas fa-terminal"></i>
                                <span>Full Stack Dev</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECCIÓN PROJECTS -->
        <section id="projects" class="section projects-section">
            <div class="section-content">
                <p class="section-label">▸ featured work</p>
                <div class="projects-grid">
                    
                    <!-- PROYECTO 1: VS Code | Kryhub -->
                    <div class="project-card active-project">
                        <div class="project-header">
                            <div class="project-icon"><i class="fas fa-code"></i></div>
                            <div class="status-badge active">
                                <span class="status-dot"></span>
                                ACTIVE
                            </div>
                        </div>
                        <h3>VS Code | Kryhub</h3>
                        <p class="project-desc">PROYECTO DE MODIFICACION DE HUB WINDUI SE USA PARA SCRIPTS Y SCRIPTS AVANZADOS PARA JUEGOS EXPLOITS</p>
                        <div class="project-stats">
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span class="stat-number-project" data-target="3">0</span>
                                <span>colaboradores</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-crown"></i>
                                <span>Owner: 4kryx</span>
                            </div>
                        </div>
                        <div class="project-hover-effect"></div>
                    </div>

                    <!-- PROYECTO 2: Steal a Latam - Ex Developer -->
                    <div class="project-card offline-project">
                        <div class="project-header">
                            <div class="project-icon"><i class="fas fa-skull"></i></div>
                            <div class="status-badge offline">
                                <span class="status-dot"></span>
                                OFFLINE
                            </div>
                        </div>
                        <h3>Steal a Latam <span class="ex-dev">- Ex Developer</span></h3>
                        <p class="project-desc">PROYECTO GRANDE DE ROBLOX</p>
                        <div class="project-stats">
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span class="stat-number-project" data-target="8">0</span>
                                <span>colaboradores</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-comment-slash"></i>
                                <span>Chat sin censura</span>
                                <span class="offline-tag">OFFLINE</span>
                            </div>
                        </div>
                        <div class="offline-overlay">
                            <i class="fas fa-database"></i>
                            <span>Archived Project</span>
                        </div>
                        <div class="project-hover-effect"></div>
                    </div>

                    <!-- PROYECTO 3: Chat sin censura - Ex Developer & Moderator -->
                    <div class="project-card offline-project">
                        <div class="project-header">
                            <div class="project-icon"><i class="fas fa-comment-dots"></i></div>
                            <div class="status-badge offline">
                                <span class="status-dot"></span>
                                OFFLINE
                            </div>
                        </div>
                        <h3>Chat sin censura <span class="ex-dev">- Ex Developer & Moderator</span></h3>
                        <p class="project-desc">PROYECTO EN EQUIPO ELIMINADO POR ROBLOX</p>
                        <div class="project-stats">
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span class="stat-number-project" data-target="3">0</span>
                                <span>colaboradores</span>
                            </div>
                        </div>
                        <div class="offline-overlay">
                            <i class="fas fa-database"></i>
                            <span>Archived Project</span>
                        </div>
                        <div class="project-hover-effect"></div>
                    </div>

                    <!-- PROYECTO 4: Join Any Player - Ex Developer -->
                    <div class="project-card offline-project">
                        <div class="project-header">
                            <div class="project-icon"><i class="fas fa-user-plus"></i></div>
                            <div class="status-badge offline">
                                <span class="status-dot"></span>
                                OFFLINE
                            </div>
                        </div>
                        <h3>Join Any Player <span class="ex-dev">- Ex Developer</span></h3>
                        <p class="project-desc">PROYECTO ENTRE 4 PERSONAS ELIMINADO POR ROBLOX</p>
                        <div class="project-stats">
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span class="stat-number-project" data-target="4">0</span>
                                <span>colaboradores</span>
                            </div>
                        </div>
                        <div class="offline-overlay">
                            <i class="fas fa-database"></i>
                            <span>Archived Project</span>
                        </div>
                        <div class="project-hover-effect"></div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>4KRYX © 2025 — Developer & Creator | Built with passion | Made in Vs code to Vercel app</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
