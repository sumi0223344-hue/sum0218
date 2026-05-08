
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNPU_2g7Juyhdva0XTjRVp7c5EqDYCCpQ",
    authDomain: "sum0218-01121209-1acf4.firebaseapp.com",
    projectId: "sum0218-01121209-1acf4",
    storageBucket: "sum0218-01121209-1acf4.firebasestorage.app",
    messagingSenderId: "464901556959",
    appId: "1:464901556959:web:46db1a6bdc488c4f02376a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// DOM Elements
const menuIntro = document.getElementById('menu-intro');
const menuLocation = document.getElementById('menu-location');
const menuGallery = document.getElementById('menu-gallery');
const introSection = document.getElementById('intro');
const locationSection = document.getElementById('location');
const gallerySection = document.getElementById('gallery');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const uploadBtn = document.getElementById('upload-btn');
const galleryList = document.getElementById('gallery-list');
const uploadModal = document.getElementById('upload-modal');
const imageUpload = document.getElementById('image-upload');
const imageDesc = document.getElementById('image-desc');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Navigation
menuIntro.addEventListener('click', () => {
    introSection.style.display = 'block';
    locationSection.style.display = 'none';
    gallerySection.style.display = 'none';
});

menuLocation.addEventListener('click', () => {
    introSection.style.display = 'none';
    locationSection.style.display = 'block';
    gallerySection.style.display = 'none';
});

menuGallery.addEventListener('click', () => {
    introSection.style.display = 'none';
    locationSection.style.display = 'none';
    gallerySection.style.display = 'block';
});

// Auth
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            alert(error.message);
        });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

auth.onAuthStateChanged(user => {
    if (user && user.email.split('@')[0] === 'system') {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        uploadBtn.style.display = 'block';
        emailInput.style.display = 'none';
        passwordInput.style.display = 'none';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        uploadBtn.style.display = 'none';
        emailInput.style.display = 'block';
        passwordInput.style.display = 'block';
    }
    loadGallery();
});

// Gallery
uploadBtn.addEventListener('click', () => {
    uploadModal.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    uploadModal.style.display = 'none';
});

saveBtn.addEventListener('click', () => {
    const file = imageUpload.files[0];
    const description = imageDesc.value;
    if (file) {
        const storageRef = storage.ref(`gallery/${file.name}`);
        storageRef.put(file).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                db.collection('gallery').add({
                    imageUrl: downloadURL,
                    description: description,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    uploadModal.style.display = 'none';
                    imageUpload.value = '';
                    imageDesc.value = '';
                    loadGallery();
                });
            });
        });
    }
});

function loadGallery() {
    galleryList.innerHTML = '';
    db.collection('gallery').orderBy('createdAt', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
            const item = doc.data();
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.description}">
                <p>${item.description}</p>
            `;

            if (auth.currentUser && auth.currentUser.email.split('@')[0] === 'system') {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '삭제';
                deleteBtn.addEventListener('click', () => {
                    db.collection('gallery').doc(doc.id).delete().then(() => {
                        loadGallery();
                    });
                });

                const editBtn = document.createElement('button');
                editBtn.textContent = '수정';
                editBtn.addEventListener('click', () => {
                    const newDesc = prompt("새로운 설명을 입력하세요", item.description);
                    if (newDesc !== null) {
                        db.collection('gallery').doc(doc.id).update({
                            description: newDesc
                        }).then(() => {
                            loadGallery();
                        });
                    }
                });
                galleryItem.appendChild(editBtn)
                galleryItem.appendChild(deleteBtn);
            }
            galleryList.appendChild(galleryItem);
        });
    });
}
