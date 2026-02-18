
// Initialize Firebase from firebase-config.js
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const uploadForm = document.getElementById('upload-form');
    const stoneListDiv = document.getElementById('stone-list');

    // Check user auth state
    auth.onAuthStateChanged(user => {
        if (!user) {
            // If not logged in, redirect to login page
            window.location.href = '/admin.html';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = '/admin.html';
        });
    });

    // Upload new stone
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('stone-title').value;
        const size = document.getElementById('stone-size').value;
        const origin = document.getElementById('stone-origin').value;
        const imageFile = document.getElementById('stone-image').files[0];
        
        if (!imageFile) { return alert('이미지를 선택해주세요.'); }

        const storageRef = storage.ref(`stones/${Date.now()}_${imageFile.name}`);
        const uploadTask = storageRef.put(imageFile);

        uploadTask.on('state_changed', 
            (snapshot) => { /* progress */ }, 
            (error) => { console.error("Upload failed:", error); },
            () => {
                // Upload complete, get download URL
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Save stone info to Firestore
                    db.collection('stones').add({
                        title: title,
                        size: size,
                        origin: origin,
                        imageUrl: downloadURL,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        alert('새 수석이 등록되었습니다.');
                        uploadForm.reset();
                        loadStones(); // Refresh list
                    });
                });
            }
        );
    });

    // Load and display stones
    function loadStones() {
        stoneListDiv.innerHTML = '';
        db.collection('stones').orderBy('createdAt', 'desc').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const stone = doc.data();
                const stoneEl = document.createElement('div');
                stoneEl.innerHTML = `
                    <p>
                        <strong>${stone.title}</strong> (${stone.size}, ${stone.origin}) 
                        <button data-id="${doc.id}">삭제</button>
                    </p>`;
                stoneListDiv.appendChild(stoneEl);
            });
        });
    }

    // Delete stone
    stoneListDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const stoneId = e.target.dataset.id;
            if (confirm('정말로 이 수석을 삭제하시겠습니까?')) {
                db.collection('stones').doc(stoneId).delete().then(() => {
                    alert('삭제되었습니다.');
                    loadStones(); // Refresh list
                });
            }
        }
    });

    loadStones(); // Initial load
});
