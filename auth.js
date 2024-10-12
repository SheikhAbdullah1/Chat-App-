//for login signup page
;(() => {
  let num = localStorage.getItem('num')
  if (num == '1') {
    redirectToLoginForm()
  }
})()
let userId = 1000

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCUji4-JfSaZdPSIWtaWmky-WWZeUtJXOU',
  authDomain: 'rj-batch-firstproject.firebaseapp.com',
  projectId: 'rj-batch-firstproject',
  storageBucket: 'rj-batch-firstproject.appspot.com',
  messagingSenderId: '272981953864',
  appId: '1:272981953864:web:26c0ad8cf3fa017678b77d',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore(app)

//getting users array from local storage
let users = []

function getUsersArrayFromLocalStorage() {
  if (JSON.parse(localStorage.getItem('usersArray'))) {
    users = JSON.parse(localStorage.getItem('usersArray')) || []
  }
}
getUsersArrayFromLocalStorage()

let signUpButton = document.getElementById('signUpButton')
let loginButton = document.getElementById('loginButton')
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

function errorDisplayer(message, type) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('')
  alertPlaceholder.append(wrapper)
}

signUpButton.addEventListener('click', (e) => {
  e.preventDefault()
  let signUpform = document.getElementsByClassName('signUpForm')[0]
  let username = document.getElementById('signUpUsername')
  let email = document.getElementById('signUpEmail')
  let password = document.getElementById('signUpPassword')
  let emailValidationRegx =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  let validation = true
  alertPlaceholder.innerHTML = ''

  if (!username.value) {
    errorDisplayer('Enter the username', 'danger')
    validation = false
  } else if (!email.value.match(emailValidationRegx)) {
    errorDisplayer('Invalid email address', 'danger')
    validation = false
  } else if (users.find((cur) => cur.email == email.value)) {
    errorDisplayer('email already registered on another account', 'danger')
    validation = false
  } else if (password.value.length < 8) {
    errorDisplayer('password must be 8 or more characters long', 'danger')
    validation = false
  }
  if (validation) {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user
        console.log(user)
        // ...
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message)
        // ..
      })
    let newlyCreatedUser = {
      userId: userId + 1,
      username: username.value,
      email: email.value,
      password: password.value,
    }
    if (users.length) {
      newlyCreatedUser.userId = users[users.length - 1].userId + 1
    }
    users.push(newlyCreatedUser)

    username.value = ''
    email.value = ''
    password.value = ''
    localStorage.setItem('usersArray', JSON.stringify(users))
    // swal({title:"Registered", icon:"success"});
    getUsersArrayFromLocalStorage()
    redirectToLoginForm()
  }
})
document
  .getElementById('redirectToLoginFormBtn')
  .addEventListener('click', (e) => {
    e.preventDefault()
    redirectToLoginForm()
  })
function redirectToLoginForm() {
  let signUpform = document.getElementsByClassName('signUpForm')[0]
  let loginForm = document.getElementsByClassName('loginForm')[0]
  signUpform.classList.add('hidden')
  loginForm.classList.remove('hidden')
}
document
  .getElementById('redirectToSignUpFormBtn')
  .addEventListener('click', (e) => {
    e.preventDefault()
    redirectToSignUpForm()
  })
function redirectToSignUpForm() {
  let signUpform = document.getElementsByClassName('signUpForm')[0]
  let loginForm = document.getElementsByClassName('loginForm')[0]
  signUpform.classList.remove('hidden')
  loginForm.classList.add('hidden')
}

loginButton.addEventListener('click', (e) => {
  e.preventDefault()
  let loginEmail = document.getElementById('loginEmail')
  let password = document.getElementById('loginPassword')
  alertPlaceholder.innerHTML = ''

  let validation = true
  if (!loginEmail.value) {
    errorDisplayer('Enter the email', 'danger')
    validation = false
  }
  if (!password.value) {
    errorDisplayer('Enter the password', 'danger')
    validation = false
  }
  if (validation) {
    signInWithEmailAndPassword(auth, loginEmail.value, password.value)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user)
        window.location = '../home/home.html'
        // ...
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message)
      })
    getUsersArrayFromLocalStorage()
    let user = users.find((cur) => {
      return cur.email == loginEmail.value
    })
    if (!user) {
      errorDisplayer('email is not registered', 'danger')
      // validation = false;
    } else if (user.password != password.value) {
      errorDisplayer('password is incorrect', 'danger')
      // validation = false;
    } else {
      loginEmail.value = ''
      password.value = ''
      localStorage.setItem('currentUser', JSON.stringify(user))
      // swal({title:"Logined", icon:"success"});
      // window.location = '../home/home.html'
    }
  }
})
document.getElementById('signupGoogle').addEventListener('click', (e) => {
  e.preventDefault()
  withGoogle()
})
document.getElementById('loginGoogle').addEventListener('click', (e) => {
  e.preventDefault()
  withGoogle()
})
function withGoogle() {
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
    .then((result) => {
      // Signed in successfully
      console.log('Signed in with Google:', result.user)
      window.location = '../home/home.html'
    })
    .catch((error) => {
      // Handle errors here
      console.log('Error signing in with Google:', error)
    })
}
