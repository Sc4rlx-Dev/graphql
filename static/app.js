export let Data = null
import { ce, div, button, input } from "./createlem.js"
import { GenerateToken } from "./api.js"
import { Auth } from "./auth.js"
import { query } from "./query.js"

export function login() {
    const body = document.body
    body.setAttribute('class', 'login-page fade-in.delay-3')
    body.innerHTML = "" 

    const loginForm = createLoginForm()
    const footer = createPowerdbyFooter()

    body.append(loginForm, footer)
}


function createLoginForm() {
    // HADA HUWA L-KHATA2 LI KAN (setS -> setAtr)
    const errorP = ce('p', 'error', 'Your email and password is required').setAtr('style', 'display: none') 
    const loginBtn = button('login-btn', 'LOGIN')
    loginBtn.addEventListener('click', () => {
        const rightDiv = loginBtn.parentElement
        const email = rightDiv.querySelector('input[name="Email"]').value
        const password = rightDiv.querySelector('input[name="Password"]').value
        GenerateToken(email, password, errorP) 
    })

    const left = div('left').append(
        ce('img', '').setAtr('src', './assets/imgs/login_img.svg').setAtr('alt', 'Login Image')
    )
    const right = div('right').append(
        ce('h2', '', 'Login'),
        input('email', 'Email'),
        input('password', 'Password'),
        errorP, 
        loginBtn
    )
    return div('container-login container-login2').append(left, right)
}


function createPowerdbyFooter() {
    return div('Powerdby').append(
        ce('a', '', 'Powered By oerraoui').setAtr('href', 'https://www.linkedin.com/in/oussama-er-raoui/').setAtr('target', '_blank')
    )
}

export async function Homepage() {
    const body = document.body
    body.removeAttribute('class')
    body.innerHTML = "<h1>Loading...</h1>" 

    const userData = await fetchUserData() 
        
    if (!userData) {
        login() 
        return
    }

    Data = userData 
    body.innerHTML = "" 

    const header = createHeader()
    const dashboard = createDashboardContainer()
    
    body.append(header, ce('br'), dashboard)

    CercleSvg() 
    getxps(Data) 

    const xpInfoBox = XpAmount() 
    body.append(xpInfoBox)

    // Kan zid l-class hna, melli l-header w l-button kaynin
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn) homeBtn.classList.add('window_active');
}

async function fetchUserData() {
    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ query: query() })
        })

        const data = await response.json()
        
        if (data.errors || !data.data || !data.data.user) {
            console.error('Error fetching data:', data.errors ? data.errors : 'No user data')
            return null 
        }
        console.log("data errrr ", data.data)
        return data.data
        
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}


function createHeader() {
    const header = div("header").append(
        div("logo", '').append(
            ce('img', '').setAtr('src', './assets/imgs/logo.svg').setAtr('alt', 'Logo')
        ),
        div("nav")
            .append(
                button("nav-btn home-btn", "Home"),
                button("nav-btn profile-btn", "Profile"),
                button("nav-btn logout-btn", "Logout")
            )
    )

    header.querySelector('.home-btn').addEventListener('click', Homepage)
    header.querySelector('.profile-btn').addEventListener('click', Profile)
    header.querySelector('.logout-btn').addEventListener('click', Lougout)

    return header
}

function createDashboardContainer() {
    const container = div('Container', '').append(
        div('polygone-section fade-in delay-2').append(
            ce('h1', '', 'Best skills'),
            ce('section', '', '').setAtr('id', 'polygone')
        ),
        div('Chart-section fade-in delay-1').append(
            ce('h1', '', 'Projects by XP'),
            div('CercleSvg').setAtr('id', 'CercleSvgSetion')
        ).append(
            ce('p', 'barinfo', 'Bar Info : ').append(
                ce('span', 'projectname', 'Hover over a bar to see the project Information'),
                ce('span', 'projectxp', '').setAtr('id', 'projectxp')
            )
        )
    )
    return container;
}


function Lougout() {
    localStorage.removeItem('token')
    Data = null
    Auth()
}

function Profile() {
    if (!Data) {
        login()
        return
    }
    
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn) homeBtn.classList.remove('window_active');
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) profileBtn.classList.add('window_active');


    let body = document.body
    
    let Container = document.querySelector('.Container')
    if (Container) Container.remove();

    let xpInfo = document.querySelector('#XPINFO');
    if (xpInfo) xpInfo.remove();

    if (body.querySelector('.profile')) {
        body.querySelector('.profile').remove()
    }

    let profile = div("profile").append(
        ce('section', 'profile-header').append(
            ce('h1', '', 'Profile'),
            ce('img', '').setAtr('src', 'https://www.svgrepo.com/show/316473/user-1.svg').setAtr('alt', 'Profile Icon')
        ),
        div('profile-body').append(
            ce('section', 'name').append(
                ce('section', 'firstname').append(
                    ce('p', '', 'First Name'),
                    ce('h2', '', `${Data.user[0].firstName}`)
                ),
                ce('section', 'lastname').append(
                    ce('p', '', 'Last Name'),
                    ce('h2', '', `${Data.user[0].lastName}`)
                ),
            ),
            div('audit-email').append(
                ce('section', 'Email').append(
                    ce('img', '').setAtr('src', 'https://www.svgrepo.com/show/473944/email.svg').setAtr('alt', 'Email Icon'),
                    ce('p', '', 'Email'),
                    ce('h2', '', `${Data.user[0].email}`)
                ),
                ce('section', 'Audit-Ratio').append(
                    ce('img', '').setAtr('src', 'https://www.svgrepo.com/show/518874/ratio.svg').setAtr('alt', 'Audit Icon'),
                    ce('p', '', 'Audit Ratio'),
                    ce('h2', '', `${(Data.user[0].auditRatio).toFixed(2)}KB`)
                )
            ),
        )
    )
    let prfxp = div('profile-xp').append(
        ce('section', 'Xp').append(
            ce('p', '', 'XP Amount'),
            ce('h2', '', `${Math.round(XPS / 1000)}KB`) 
        ),
        ce('section', 'Xp').append(
            ce('p', '', 'Username'),
            ce('h2', '', `${Data.user[0].login}`)
        )
    )
    profile.append(prfxp)
    
    const header = document.querySelector('.header');
    if (header) {
        header.insertAdjacentElement('afterend', profile);
    } else {
        body.append(profile);
    }
}

function CercleSvg() {
    const svgNS = "http://www.w3.org/2000/svg"
    let cn = document.querySelector(".polygone-section")
    if (!cn) return
    const width = cn.clientWidth
    const height = Math.min(width, 350)
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 20
    const transactions = Data.user[0].transactions
    const maxXP = 100

    if (!transactions || transactions.length === 0) {
        console.error("No transactions found.")
        return
    }
    const oldSvg = document.getElementById("svgChart100")
    if (oldSvg) oldSvg.remove()
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("id", "svgChart100")
    svg.setAttribute("width", width)
    svg.setAttribute("height", height)
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    const container = document.querySelector("#polygone")
    if (!container) {
        console.error("Container #polygone not found.")
        return
    }
    container.append(svg)
    const points = []
    for (let i = 1; i <= 10; i++) {
        const valuePercent = i / 10
        const r = radius * valuePercent
        const ring = document.createElementNS(svgNS, "circle")
        ring.setAttribute("cx", centerX)
        ring.setAttribute("cy", centerY)
        ring.setAttribute("r", r)
        ring.setAttribute("fill", "none")
        ring.setAttribute("stroke-width", "0.5")
        ring.setAttribute("stroke-dasharray", "2,2")
        svg.appendChild(ring)
    }

    transactions.forEach(({ type, amount }, i) => {
        const normalized = amount / maxXP
        const angle = (2 * Math.PI / transactions.length) * i
        const x = centerX + normalized * radius * Math.cos(angle)
        const y = centerY + normalized * radius * Math.sin(angle)
        points.push({ x, y })

        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("cx", x)
        circle.setAttribute("cy", y)
        circle.setAttribute("r", 5)
        svg.appendChild(circle)

        const label = document.createElementNS(svgNS, "text")
        const offsetX = 10 * Math.cos(angle)
        const offsetY = 10 * Math.sin(angle)
        label.setAttribute("x", x + offsetX)
        label.setAttribute("y", y + offsetY)
        label.setAttribute("font-size", "16")
        label.setAttribute("text-anchor", "middle")
        label.setAttribute("alignment-baseline", "middle")
        label.setAttribute("font-weight", "600")
        circle.addEventListener("mouseover", () => {
            label.textContent = type
        })
        circle.addEventListener("mouseout", () => {
            label.textContent = ""
        })
        svg.appendChild(label)
    })

    for (let i = 0; i < points.length; i++) {
        const next = (i + 1) % points.length
        const line = document.createElementNS(svgNS, "line")
        line.setAttribute("x1", points[i].x)
        line.setAttribute("y1", points[i].y)
        line.setAttribute("x2", points[next].x)
        line.setAttribute("y2", points[next].y)
        line.setAttribute("stroke-width", "1")
        svg.appendChild(line)
    }
}

let XPS = 0 

function getxps(data) {
    let xps = data.user[0].xps

    XPS = xps.filter((xp) => (!xp.path.includes("piscine-") || xp.path == "/oujda/module/piscine-js")).map(xp => xp.amount).reduce((a, b) => a + b, 0)
    
    let xpsAMount = xps.filter((xp) => (!xp.path.includes("piscine") && xp.path.split("/").length == 4)).filter((xp) => xp.amount > 0)
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("id", "svgChart200")
    let section = document.querySelector(".CercleSvg")
    if (!section) return; 

    const height = 300
    const padding = 50
    const minBarWidth = 40

    const minSvgWidth = Math.max(section.clientWidth, xpsAMount.length * minBarWidth + 2 * padding)
    svg.setAttribute("width", minSvgWidth) 
    svg.setAttribute("height", height)
    svg.setAttribute("viewBox", `0 0 ${minSvgWidth} ${height}`)
    const barAreaWidth = minSvgWidth - 2 * padding
    const barWidth = Math.max(10, (barAreaWidth - (xpsAMount.length - 1) * 10) / xpsAMount.length)
    const spacing = 10
    const maxXP = Math.max(...xpsAMount.map(t => t.amount).map(t => t / 1000))
    const chartHeight = height - 2 * padding
    if (maxXP === 0) {
        console.error("Maximum XP value is 0, cannot create chart.")
        svg.innerHTML = "<text x='10' y='50' fill='var(--text-color)'>No XP project data to display.</text>" 
        section.innerHTML = ""
        section.append(svg)
        return
    }
    xpsAMount.forEach((xp, index) => {
        const amount = xp.amount / 1000
        const barHeight = Math.max(0, (chartHeight / maxXP) * amount)
        const x = padding + index * (barWidth + spacing)
        const y = height - padding - barHeight
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        bar.setAttribute("x", x)
        bar.setAttribute("y", y)
        bar.setAttribute("width", barWidth)
        bar.setAttribute("height", barHeight)
        svg.append(bar)

        const prjn = document.querySelector('.projectname'); const xpAmount = document.querySelector('#projectxp')
        bar.addEventListener("mouseover", () => {
            if(prjn) prjn.textContent = xp.path.split("/").pop() + "  " + ""
            if(xpAmount) xpAmount.textContent = `${Math.round(amount)}KB`
        })
        bar.addEventListener("mouseout", () => {
            if(prjn) prjn.textContent = "Hover over a bar to see the project Information"
            if(xpAmount) xpAmount.textContent = ""
        })
    })

    section.innerHTML = ""
    section.append(svg)
}

window.addEventListener("resize", () => {
    if (Data) {
        CercleSvg()
        getxps(Data)
    }
})

function XpAmount() {
    let Container = document.createElement("div")
    Container.setAttribute("id", "XPINFO")
    Container.append(
        div("XpAmount").append(
            ce('h1', ',', 'Xp Amount'),
            ce('span', '', `${Math.round(XPS / 1000)}KB`)
        ),
        div("User").append(
            ce('h1', '', 'Login'),
            ce('span', '', `${Data.user[0].login}`)
        )
    )
    return Container
}

Auth()