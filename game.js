const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');

// Audio (assuming assets folder is present)
// const backgroundMusic = new Audio('assets/background.mp3');
// ... (other sounds)

let score = 0;
let gameInterval = null;
let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let stars = [];

const keys = { Space: false };
let isMouseDown = false;

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
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for other elements
    }

    update() {
        this.draw();
        if (this.shootCooldown > 0) this.shootCooldown--;
        if ((keys.Space || isMouseDown) && this.shootCooldown === 0) {
            this.shoot();
            this.shootCooldown = this.baseShootCooldown;
        }
    }

    shoot() {
        // shootSound.play();
        projectiles.push(new Projectile(this.x + this.width / 2 - 2.5, this.y, 5, 20, '#ff0', 7));
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
        ctx.shadowBlur = 0; // Reset
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
    player = new Player(canvas.width / 2 - 25, canvas.height - 60, 50, 50, '#0ff');
    enemies = [];
    projectiles = [];
    score = 0;
    scoreElement.textContent = score;
    createStars();
    // backgroundMusic.play();
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function gameOver() {
    clearInterval(gameInterval);
    // backgroundMusic.pause();
    startButton.style.display = 'block';
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateStars();
    player.update();

    projectiles = projectiles.filter(p => p.y > 0);
    projectiles.forEach(p => p.update());

    if (Math.random() < 0.04) {
        spawnEnemy();
    }
    enemies = enemies.filter(e => e.y < canvas.height);
    enemies.forEach(e => e.update());

    projectiles.forEach((p, pIndex) => {
        enemies.forEach((e, eIndex) => {
            if (detectCollision(p, e)) {
                // explosionSound.play();
                projectiles.splice(pIndex, 1);
                enemies.splice(eIndex, 1);
                score += 100;
                scoreElement.textContent = score;
            }
        });
    });

    enemies.forEach(e => {
        if (detectCollision(player, e)) {
            gameOver();
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
