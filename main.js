
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


// --- Dynamic Loading from Firestore ---
document.addEventListener('DOMContentLoaded', () => {
  // Check if Firebase is available
  if (typeof firebase !== 'undefined') {
    // Initialize Firebase if not already done (for main page)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    const saleGrid = document.querySelector('.sale-grid');

    db.collection('stones').orderBy('createdAt', 'desc').get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          saleGrid.innerHTML = '<p>현재 등록된 수석이 없습니다.</p>';
          return;
        }
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
        console.error("Error fetching stones: ", error);
        saleGrid.innerHTML = '<p>수석 정보를 불러오는 데 실패했습니다.</p>';
      });
  } else {
    console.warn("Firebase not configured. Admin features will not be available and stone list will be empty.");
    const saleGrid = document.querySelector('.sale-grid');
    saleGrid.innerHTML = '<p>데이터베이스에 연결할 수 없습니다.</p>';
  }
});
