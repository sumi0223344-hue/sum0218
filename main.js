
// --- Web Component for Stone Card ---
class StoneCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const title = this.getAttribute('title');
    const size = this.getAttribute('size');
    const origin = this.getAttribute('origin');
    const imageUrl = this.getAttribute('imageUrl');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--color-card-bg, #fff);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 
            0 2.8px 2.2px hsl(var(--shadow-color, 240deg 5% 50%) / 0.034),
            0 6.7px 5.3px hsl(var(--shadow-color, 240deg 5% 50%) / 0.048),
            0 12.5px 10px hsl(var(--shadow-color, 240deg 5% 50%) / 0.06),
            0 22.3px 17.9px hsl(var(--shadow-color, 240deg 5% 50%) / 0.072),
            0 41.8px 33.4px hsl(var(--shadow-color, 240deg 5% 50%) / 0.086),
            0 100px 80px hsl(var(--shadow-color, 240deg 5% 50%) / 0.12);
          transition: transform 0.3s ease;
        }
        :host(:hover) {
            transform: translateY(-5px);
        }
        img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        .content {
            padding: 1.5rem;
        }
        h3 { margin-bottom: 0.5rem; }
        p { font-size: 0.9rem; color: #666; }
      </style>
      <img src="${imageUrl}" alt="${title}">
      <div class="content">
        <h3>${title}</h3>
        <p>크기: ${size}</p>
        <p>산지: ${origin}</p>
      </div>
    `;
  }
}
customElements.define('stone-card', StoneCard);

// --- Static Fallback Data ---
const staticStones = [
    {
        title: "청송 꽃돌",
        size: "25x40x15",
        origin: "경북 청송",
        imageUrl: "https://images.unsplash.com/photo-1525994886778-389b3546b448?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "남한강 호피석",
        size: "30x20x18",
        origin: "남한강",
        imageUrl: "https://images.unsplash.com/photo-1598156102269-e38023246747?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        title: "해석",
        size: "15x15x20",
        origin: "동해",
        imageUrl: "https://images.unsplash.com/photo-1550186066-7e4368b13682?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

function loadStaticStones() {
    const saleGrid = document.querySelector('.sale-grid');
    saleGrid.innerHTML = ''; // Clear existing content
    staticStones.forEach(stone => {
        const card = document.createElement('stone-card');
        card.setAttribute('title', stone.title);
        card.setAttribute('size', stone.size);
        card.setAttribute('origin', stone.origin);
        card.setAttribute('imageUrl', stone.imageUrl);
        saleGrid.appendChild(card);
    });
}

// --- Dynamic Loading Logic ---
document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    // Initialize Firebase if not already done
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const saleGrid = document.querySelector('.sale-grid');

    db.collection('stones').orderBy('createdAt', 'desc').get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          // If DB is empty, show static data as a placeholder
          loadStaticStones(); 
          return;
        }
        saleGrid.innerHTML = ''; // Clear before populating
        querySnapshot.forEach(doc => {
          const stone = doc.data();
          const card = document.createElement('stone-card');
          card.setAttribute('title', stone.title);
          card.setAttribute('size', stone.size);
          card.setAttribute('origin', stone.origin);
          card.setAttribute('imageUrl', stone.imageUrl);
          saleGrid.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Error fetching stones from Firestore: ", error);
        // If there's an error fetching, load static data
        loadStaticStones();
      });
  } else {
    // If Firebase is not configured, load static data
    console.warn("Firebase not configured. Loading static data.");
    loadStaticStones();
  }
});
