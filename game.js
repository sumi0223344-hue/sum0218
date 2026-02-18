const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');

// Audio elements
const backgroundMusic = new Audio('assets/background.mp3');
const shootSound = new Audio('assets/shoot.wav');
const explosionSound = new Audio('assets/explosion.wav');
const powerUpSound = new Audio('assets/shoot.wav');

backgroundMusic.loop = true;

let score = 0;
let gameInterval = null;
let player;
let enemies = [];
let projectiles = [];
let powerUps = [];
let enemySpawnTimer = 0;

const keys = { Space: false };
let isMouseDown = false;

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
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.y -= this.speed;
    }
}

class PowerUp {
    constructor(x, y, width, height, color, speed, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.type = type;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.y += this.speed;
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
        ctx.fillStyle = this.color;
        const w = this.width / 5;
        const h = this.height / 5;

        // Pixel art for the player's ship
        ctx.fillRect(this.x + w * 2, this.y, w, h); // Top cockpit
        ctx.fillRect(this.x + w, this.y + h, w * 3, h); // Body
        ctx.fillRect(this.x, this.y + h * 2, w * 5, h); // Wings
        ctx.fillRect(this.x + w, this.y + h * 3, w * 3, h); // Lower Body
        ctx.fillRect(this.x + w * 2, this.y + h * 4, w, h); // Tail

        if (this.shieldTimer > 0) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
        }
    }

    update() {
        this.draw();
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        if ((keys.Space || isMouseDown) && this.shootCooldown === 0) {
            this.shoot();
            this.shootCooldown = this.rapidFireTimer > 0 ? this.baseShootCooldown / 2 : this.baseShootCooldown;
        }

        if (this.rapidFireTimer > 0) this.rapidFireTimer--;
        if (this.shieldTimer > 0) this.shieldTimer--;
    }

    shoot() {
        shootSound.currentTime = 0;
        shootSound.play();
        projectiles.push(new Projectile(this.x + this.width / 2 - 2.5, this.y, 5, 20, '#ff0', 7));
    }

    activateRapidFire() {
        this.rapidFireTimer = 300;
        powerUpSound.currentTime = 0;
        powerUpSound.play();
    }

    activateShield() {
        this.shieldTimer = 600;
        powerUpSound.currentTime = 0;
        powerUpSound.play();
    }
}

class Enemy {
    constructor(x, y, width, height, color, speed, enemyType) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.enemyType = enemyType;
        this.direction = 1;
    }

    draw() {
        ctx.fillStyle = this.color;
        const w = this.width / 4;
        const h = this.height / 4;

        // Inverted pixel art for the enemy ship
        if (this.enemyType === 'straight') {
            ctx.fillRect(this.x + w, this.y, w * 2, h); // Top
            ctx.fillRect(this.x, this.y + h, w * 4, h); // Body/Wings
            ctx.fillRect(this.x + w, this.y + h * 2, w * 2, h); // Lower Body
            ctx.fillRect(this.x + w, this.y + h * 3, w * 2, h); // Tail
        } else { // zigzag
            ctx.fillRect(this.x, this.y, w * 4, h);
            ctx.fillRect(this.x + w, this.y + h, w*2, h);
            ctx.fillRect(this.x, this.y + h*2, w, h);
            ctx.fillRect(this.x + w*3, this.y + h*2, w, h);
            ctx.fillRect(this.x + w, this.y + h*3, w*2, h);
        }
    }

    update() {
        this.draw();
        this.y += this.speed;

        if (this.enemyType === 'zigzag') {
            this.x += this.speed * this.direction;
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.direction *= -1;
            }
        }
    }
}

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 40);
    const y = -40;
    const width = 40;
    const height = 40;
    const speed = 2;
    const enemyType = Math.random() < 0.5 ? 'straight' : 'zigzag';
    const color = enemyType === 'straight' ? '#999' : '#ccc';

    enemies.push(new Enemy(x, y, width, height, color, speed, enemyType));
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
    powerUps = [];
    score = 0;
    scoreElement.textContent = score;
    enemySpawnTimer = 0;
    startButton.style.display = 'none';
    backgroundMusic.play();
    gameInterval = setInterval(updateGame, 1000 / 60);
}

function gameOver() {
    clearInterval(gameInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    startButton.style.display = 'block';
    startScreen.style.display = 'flex';
    canvas.style.display = 'none';
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();

    projectiles = projectiles.filter(p => p.y + p.height > 0);
    projectiles.forEach(p => p.update());

    enemySpawnTimer++;
    if (enemySpawnTimer > 100) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }
    enemies = enemies.filter(e => e.y < canvas.height);
    enemies.forEach(e => e.update());

    powerUps = powerUps.filter(pu => pu.y < canvas.height);
    powerUps.forEach(pu => pu.update());

    projectiles.forEach((p, pIndex) => {
        enemies.forEach((e, eIndex) => {
            if (detectCollision(p, e)) {
                if (Math.random() < 0.1) powerUps.push(new PowerUp(e.x, e.y, 20, 20, '#f9a825', 3, 'rapidFire'));
                else if (Math.random() < 0.05) powerUps.push(new PowerUp(e.x, e.y, 20, 20, '#00f', 3, 'shield'));

                explosionSound.currentTime = 0;
                explosionSound.play();
                projectiles.splice(pIndex, 1);
                enemies.splice(eIndex, 1);
                score += 100;
                scoreElement.textContent = score;
            }
        });
    });

    enemies.forEach(e => {
        if (detectCollision(player, e) && player.shieldTimer === 0) {
            gameOver();
        }
    });

    powerUps.forEach((pu, puIndex) => {
        if (detectCollision(player, pu)) {
            if (pu.type === 'rapidFire') player.activateRapidFire();
            else if (pu.type === 'shield') player.activateShield();
            powerUps.splice(puIndex, 1);
        }
    });
}

window.addEventListener('keydown', (e) => { if (e.code in keys) keys[e.code] = true; });
window.addEventListener('keyup', (e) => { if (e.code in keys) keys[e.code] = false; });

canvas.addEventListener('mousemove', (e) => {
    if (player) {
        const rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        player.x = Math.max(0, Math.min(canvas.width - player.width, mouseX - player.width / 2));
    }
});

canvas.addEventListener('mousedown', () => { isMouseDown = true; });
canvas.addEventListener('mouseup', () => { isMouseDown = false; });

startButton.addEventListener('click', startGame);
