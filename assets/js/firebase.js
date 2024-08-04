import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyCk83Hb2_sp8IMxwrQqBSmwvX4aEsydAsY",
    authDomain: "jsi-project-7c0f8.firebaseapp.com",
    projectId: "jsi-project-7c0f8",
    storageBucket: "jsi-project-7c0f8.appspot.com",
    messagingSenderId: "439960833178",
    appId: "1:439960833178:web:f913f98faca85b1159a323"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const googleLogin = document.getElementById("google-login-btn");
const loginForm = document.getElementById("login-in");
const signupForm = document.getElementById("login-up");

googleLogin.addEventListener("click", function () {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        console.log(result.user);
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Error during Google sign-in:", error);
    });
});

loginForm.addEventListener('click', (event) => {
    event.preventDefault();
    const emailSignIn = document.getElementById("emailSignIn");
    const passwordSignIn = document.getElementById("passwordSignIn");

    const auth = getAuth(); 

    signInWithEmailAndPassword(auth, emailSignIn.value, passwordSignIn.value)
        .then((userCredential) => {
            showMessage('login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            }
            else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        })
})

signupForm.addEventListener('click', (event) => {
    event.preventDefault();

    const emailSignUp = document.getElementById("emailSignUp").value;
    const usernameSignUp = document.getElementById("usernameSignUp").value;
    const passwordSignUp = document.getElementById("passwordSignUp").value;

    createUserWithEmailAndPassword(auth, emailSignUp, passwordSignUp)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: emailSignUp,
                password: passwordSignUp,
                username: usernameSignUp
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    console.log("User data saved to Firestore");
                })
                .catch((error) => {
                    console.error("Error saving user data to Firestore: ", error);
                    showMessage(`Error: ${error.message}`, 'signUpMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error [${errorCode}]: ${errorMessage}`);
            showMessage(`Error: ${errorMessage}`, 'signUpMessage');
        });
});

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 3000);
}