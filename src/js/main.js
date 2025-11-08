import { generateToken, fetchUserData } from './api.js'

const app = document.getElementById('app')
let AppData = null

function renderLogin() {
    app.innerHTML = ''
    const loginForm = document.createElement('div')
    loginForm.className = 'login-container'
    loginForm.innerHTML = `
        <h2>Login</h2>
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <button id="login-btn">Login</button>
        <p id="error-msg"></p>
    `
    app.appendChild(loginForm)

    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const errorMsg = document.getElementById('error-msg')
        
        try {
            await generateToken(email, password)
            renderHomepage()
        } catch (error) {
            errorMsg.textContent = error.message
        }
    })
}

function renderLogout() {
    localStorage.removeItem('token')
    AppData = null
    renderLogin()
}

async function renderHomepage() {
    const token = localStorage.getItem('token')
    if (!token) {
        renderLogin()
        return
    }

    try {
        if (!AppData) {
            app.innerHTML = '<h1>Loading...</h1>'
            AppData = await fetchUserData(token)
        }

        app.innerHTML = ''
        const nav = document.createElement('nav')
        nav.innerHTML = `
            <button id="home-btn">Home</button>
            <button id="profile-btn">Profile</button>
            <button id="logout-btn">Logout</button>
        `
        app.appendChild(nav)

        const dashboard = document.createElement('div')
        dashboard.className = 'dashboard'
        dashboard.innerHTML = `
            <h1>Welcome, ${AppData.user[0].firstName}</h1>
            <div class="charts-container">
                <div id="skills-chart-container">
                    <h2>Best Skills</h2>
                    <canvas id="skills-chart"></canvas> 
                </div>
                <div id="xp-chart-container">
                    <h2>Projects by XP</h2>
                    <canvas id="xp-chart"></canvas>
                </div>
            </div>
        `
        app.appendChild(dashboard)

        document.getElementById('home-btn').addEventListener('click', renderHomepage)
        document.getElementById('profile-btn').addEventListener('click', renderProfile)
        document.getElementById('logout-btn').addEventListener('click', renderLogout)

        renderCharts()

    } catch (error) {
        console.error('Failed to fetch data:', error)
        renderLogout()
    }
}

function renderProfile() {
    if (!AppData) {
        renderHomepage()
        return
    }

    app.innerHTML = ''
    const nav = document.createElement('nav')
    nav.innerHTML = `
        <button id="home-btn">Home</button>
        <button id="profile-btn">Profile</button>
        <button id="logout-btn">Logout</button>
    `
    app.appendChild(nav)

    const profileData = AppData.user[0]
    const profilePage = document.createElement('div')
    profilePage.className = 'profile-container'
    profilePage.innerHTML = `
        <h2>${profileData.firstName} ${profileData.lastName}</h2>
        <p><strong>Login:</strong> ${profileData.login}</p>
        <p><strong>Email:</strong> ${profileData.email}</p>
        <p><strong>Audit Ratio:</strong> ${profileData.auditRatio.toFixed(2)}</p>
    `
    app.appendChild(profilePage)

    document.getElementById('home-btn').addEventListener('click', renderHomepage)
    document.getElementById('profile-btn').addEventListener('click', renderProfile)
    document.getElementById('logout-btn').addEventListener('click', renderLogout)
}

function renderCharts() {
    const skillsCtx = document.getElementById('skills-chart').getContext('2d')
    const skillsData = AppData.user[0].transactions

    new Chart(skillsCtx, {
        type: 'radar',
        data: {
            labels: skillsData.map(skill => skill.type.replace('skill_', '')),
            datasets: [{
                label: 'Skill Amount',
                data: skillsData.map(skill => skill.amount),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
            }]
        }
    })

    const allXps = AppData.user[0].xps
    const projectXps = allXps
        .filter(xp => !xp.path.includes("piscine") && xp.path.split("/").length === 4)
        .filter(xp => xp.amount > 0)

    const xpCtx = document.getElementById('xp-chart').getContext('2d')

    new Chart(xpCtx, {
        type: 'bar',
        data: {
            labels: projectXps.map(xp => xp.path.split("/").pop()),
            datasets: [{
                label: 'XP (in KB)',
                data: projectXps.map(xp => Math.round(xp.amount / 1000)),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }]
        }
    })
}

function init() {
    const token = localStorage.getItem('token')
    if (token) {
        renderHomepage()
    } else {
        renderLogin()
    }
}

init()
