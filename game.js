const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');

// Audio placeholders
// const shootSound = new Audio('assets/shoot.wav');
// const explosionSound = new Audio('assets/explosion.wav');
// const powerUpSound = new Audio('assets/powerup.wav');

let score = 0;
let gameInterval = null;
let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let stars = [];

const keys = { Space: false };
let isMouseDown = false;

// Starry background functions
function createStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 2 + 1
        });
    }
}

function updateStars() {
    ctx.fillStyle = '#fff';
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 15;
        this.type = type;
        this.speed = 3;
        this.color = this.type === 'rapidFire' ? '#f9a825' : '#4fc3f7'; // Orange for rapid, Blue for shield
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        this.draw();
        this.y += this.speed;
    }
}

class Projectile {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
    update() {
        this.draw();
        this.y -= this.speed;
    }
}

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.shootCooldown = 15;
        this.baseShootCooldown = 15;
        this.rapidFireTimer = 0;
        this.shieldTimer = 0;
    }

    draw() {
        // Draw ship
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Draw shield
        if (this.shieldTimer > 0) {
            ctx.strokeStyle = '#4fc3f7';
            ctx.shadowColor = '#4fc3f7';
            ctx.shadowBlur = 25;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
    }

    update() {
        this.draw();
        if (this.shootCooldown > 0) this.shootCooldown--;
        if ((keys.Space || isMouseDown) && this.shootCooldown === 0) {
            this.shoot();
            this.shootCooldown = this.rapidFireTimer > 0 ? this.baseShootCooldown / 3 : this.baseShootCooldown;
        }
        if (this.rapidFireTimer > 0) this.rapidFireTimer--;
        if (this.shieldTimer > 0) this.shieldTimer--;
    }

    shoot() {
        // shootSound.play();
        projectiles.push(new Projectile(this.x + this.width / 2 - 2.5, this.y, 5, 20, '#ff0', 7));
    }
    
    activateRapidFire() {
        this.rapidFireTimer = 300; // 5 seconds
        // powerUpSound.play();
    }

    activateShield() {
        this.shieldTimer = 600; // 10 seconds
        // powerUpSound.play();
    }
}

class Enemy {
     constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        this.draw();
        this.y += this.speed;
    }
}

function spawnEnemy() {
    const size = Math.random() * 30 + 30;
    const x = Math.random() * (canvas.width - size);
    const y = -size;
    const speed = Math.random() * 2 + 1;
    enemies.push(new Enemy(x, y, size, size, '#f0f', speed));
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    startButton.style.display = 'none';
    player = new Player(canvas.width / 2 - 25, canvas.height - 60, 50, 50, '#0ff');
    enemies = [];
    projectiles = [];
    powerUps = [];
    score = 0;
    scoreElement.textContent = score;
    createStars();
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function gameOver() {
    clearInterval(gameInterval);
    startButton.style.display = 'block';
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateStars();
    player.update();

    // Update projectiles
    projectiles = projectiles.filter(p => p.y > 0);
    projectiles.forEach(p => p.update());

    // Spawn and update enemies
    if (Math.random() < 0.04) {
        spawnEnemy();
    }
    enemies = enemies.filter(e => e.y < canvas.height);
    enemies.forEach(e => e.update());

    // Update power-ups
    powerUps = powerUps.filter(pu => pu.y < canvas.height);
    powerUps.forEach(pu => pu.update());

    // Projectile-Enemy collision
    projectiles.forEach((p, pIndex) => {
        enemies.forEach((e, eIndex) => {
            if (detectCollision(p, e)) {
                // explosionSound.play();
                projectiles.splice(pIndex, 1);
                enemies.splice(eIndex, 1);
                score += 100;
                scoreElement.textContent = score;

                // Spawn power-up chance
                if (Math.random() < 0.1) {
                    powerUps.push(new PowerUp(e.x, e.y, 'rapidFire'));
                } else if (Math.random() < 0.05) {
                    powerUps.push(new PowerUp(e.x, e.y, 'shield'));
                }
            }
        });
    });

    // Player-PowerUp collision
    powerUps.forEach((pu, puIndex) => {
        if (detectCollision(player, pu)) {
            if (pu.type === 'rapidFire') player.activateRapidFire();
            else if (pu.type === 'shield') player.activateShield();
            powerUps.splice(puIndex, 1);
        }
    });

    // Player-Enemy collision
    enemies.forEach((e, eIndex) => {
        if (detectCollision(player, e)) {
            if (player.shieldTimer > 0) {
                enemies.splice(eIndex, 1);
                score += 50;
                scoreElement.textContent = score;
            } else {
                gameOver();
            }
        }
    });
}

// Event Listeners
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
canvas.addEventListener('mousemove', (e) => {
    if (player) {
        const rect = canvas.getBoundingClientRect();
        player.x = e.clientX - rect.left - player.width / 2;
    }
});
canvas.addEventListener('mousedown', () => { isMouseDown = true; });
canvas.addEventListener('mouseup', () => { isMouseDown = false; });
startButton.addEventListener('click', startGame);
