let redirectToLoginFormBtn = document.getElementById('redirectToLoginFormBtn')
let redirectToSignUpFormBtn = document.getElementById('redirectToSignUpFormBtn')

let signUpButton = document.querySelector('#signUpButton')
let loginButton = document.querySelector('#loginButton')

let loginForm = document.querySelector('.loginForm')
let signUpForm = document.querySelector('.signUpForm')

// console.log(
//   redirectToLoginFormBtn,
//   redirectToSignUpFormBtn,
//   loginForm,
//   signUpForm
// )

redirectToLoginFormBtn.addEventListener('click', (e) => {
  e.preventDefault()
  loginForm.classList.remove('hidden')
  signUpForm.classList.add('hidden')
})

redirectToSignUpFormBtn.addEventListener('click', (e) => {
  e.preventDefault()
  signUpForm.classList.remove('hidden')
  loginForm.classList.add('hidden')
})

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC1AbQAWqujK-nN2vchhTFPLsxE7yTV8fc',
  authDomain: 'firebasics-3f473.firebaseapp.com',
  projectId: 'firebasics-3f473',
  storageBucket: 'firebasics-3f473.appspot.com',
  messagingSenderId: '638139066075',
  appId: '1:638139066075:web:a20a9b953d55917dda0efe',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

signUpButton.addEventListener('click', (e) => {
  e.preventDefault()
  let signUpEmail = document.querySelector('#signUpEmail')
  let signUpUsername = document.querySelector('#signUpUsername')
  let signUpPassword = document.querySelector('#signUpPassword')

  //   console.log(signUpEmail, signUpUsername, signUpPassword)
  createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value)
    .then((userCredential) => {
      // Signed up
      console.log(userCredential.user.uid)
      let userData = {
        userId: userCredential.user.uid,
        username: signUpUsername.value,
        email: signUpEmail.value,
      }
      addUserToFirestore(userData)
      // console.log(user)
      //   signUpEmail.value = ''
      //   signUpUsername.value = ''
      //   signUpPassword.value = ''
      //   window.location = './home.html'
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorMessage)
      // ..
    })
})

loginButton.addEventListener('click', (e) => {
  e.preventDefault()
  let loginEmail = document.querySelector('#loginEmail')
  let loginPassword = document.querySelector('#loginPassword')
  //   console.log(loginEmail, loginPassword)
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      console.log(user)
      loginEmail.value = ''
      loginPassword.value = ''
      window.location = 'home.html'
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorMessage)
    })
})

function addUserToFirestore(user) {
  console.log(user)
  //   addDoc(collection(db, 'users'), user)
  //     .then((res) => {
  //       console.log(res)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })

  setDoc(doc(db, 'users', `${user.userId}`), user)
    .then((res) => {
      console.log(res)
      window.location.assign('./home.html')
    })
    .catch((err) => {
      console.log(err)
    })
  signUpEmail.value = ''
  signUpUsername.value = ''
  signUpPassword.value = ''
  window.location.assign('./home.html')
}
