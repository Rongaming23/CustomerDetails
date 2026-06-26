
// ===============================
// UNISERVE CRM - AUTH MODULE (FIXED)
// ===============================

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ===============================
// LOGIN
// ===============================

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    msg.style.color = "#ef4444";
    msg.innerHTML = "";

    if (!email || !password) {
        msg.innerHTML = "Please enter email and password.";
        return;
    }

    try {

        // 🔥 IMPORTANT: set persistence FIRST (safe fix)
        await setPersistence(auth, browserLocalPersistence);

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        msg.style.color = "#16a34a";
        msg.innerHTML = "Login Successful...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 600);

    } catch (error) {

        console.error(error);

        const map = {
            "auth/invalid-email": "Invalid email address.",
            "auth/user-not-found": "User not found.",
            "auth/wrong-password": "Incorrect password.",
            "auth/invalid-credential": "Invalid email or password."
        };

        msg.innerHTML = map[error.code] || error.message;
    }
};


// ===============================
// LOGOUT
// ===============================

window.logout = async function () {

    try {
        await signOut(auth);
        window.location.href = "login.html";

    } catch (error) {
        alert(error.message);
    }
};


// ===============================
// AUTH STATE (FIXED SAFE FLOW)
// ===============================

let redirecting = false;

onAuthStateChanged(auth, (user) => {

    const page = window.location.pathname.split("/").pop();

    // ===========================
    // NOT LOGGED IN
    // ===========================
    if (!user) {

        if (page !== "login.html" && !redirecting) {
            redirecting = true;
            window.location.href = "login.html";
        }

        return;
    }

    // ===========================
    // LOGGED IN
    // ===========================
    if (page === "login.html" && !redirecting) {
        redirecting = true;
        window.location.href = "index.html";
    }
});


// ===============================
// SAFE USER HELPERS
// ===============================

window.currentUser = function () {
    return auth.currentUser || null;
};

window.currentEmail = function () {
    return auth.currentUser?.email || "";
};

window.isAdmin = function () {
    return auth.currentUser?.email === "sankudas@crm.com";
};
