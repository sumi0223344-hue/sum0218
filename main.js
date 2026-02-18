
class StoneCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const description = this.getAttribute('description');
        const size = this.getAttribute('size');
        const origin = this.getAttribute('origin');
        const imageUrl = this.getAttribute('image-url');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .card-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .card-content {
                    padding: 1rem;
                }
                h3 {
                    font-family: 'Noto Serif KR', serif;
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                p {
                    font-family: 'Noto Sans KR', sans-serif;
                    line-height: 1.5;
                    margin-bottom: 1rem;
                }
                .details {
                    font-size: 0.9rem;
                    color: oklch(50% 0.02 240);
                }
            </style>
            
            <img src="${imageUrl}" alt="${title}" class="card-image">
            <div class="card-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <p class="details">크기: ${size} / 산지: ${origin}</p>
            </div>
        `;
    }
}

customElements.define('stone-card', StoneCard);
