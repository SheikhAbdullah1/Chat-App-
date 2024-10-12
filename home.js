let profileImg = document.querySelector('#profileImg')
let logoutCard = document.querySelector('.logoutCard')
let logoutBtn = document.querySelector('#logoutBtn')
let chatContainer = document.querySelector('.chatContainer')

let sendBtn = document.querySelector('#sendMessage')

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  query,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyC1AbQAWqujK-nN2vchhTFPLsxE7yTV8fc',
  authDomain: 'firebasics-3f473.firebaseapp.com',
  projectId: 'firebasics-3f473',
  storageBucket: 'firebasics-3f473.appspot.com',
  messagingSenderId: '638139066075',
  appId: '1:638139066075:web:a20a9b953d55917dda0efe',
}

// // Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

let currentUser

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user)
    async function getUserDoc() {
      const docRef = doc(db, 'users', `${user.uid}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
        currentUser = docSnap.data()
        document.querySelector('#currentUserName').textContent =
          currentUser.username
        displayChats()
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!')
      }
    }
    getUserDoc()
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid
    // ...
  } else {
    // User is signed out
    window.location = 'index.html'
    console.log('user is not logined')
    // ...
  }
})

async function displayChats() {
  chatContainer.innerHTML = ''
  //   const querySnapshot = await getDocs(
  //     collection(db, 'chats'),
  //     orderBy('time', 'asc')
  //   )
  const q = query(collection(db, 'chats'), orderBy('time', 'asc'))

  const querySnapshot = await getDocs(q)
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    chatContainer.innerHTML = ''
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let chat = doc.data()
      console.log(chat)
      var ele = document.createElement('div')
      ele.innerHTML = `<div class="chat-user">${
        chat.userUid == currentUser.userId ? 'Me' : chat.username
      }</div>
        <p class="chat-message">${chat.chatValue}</p>
        <div class="chat-time">${chat.time}</div>`
      ele.classList.add('chat')
      if (chat.userUid == currentUser.userId) {
        ele.classList.add('chat-left')
      }
      chatContainer.append(ele)
    })
  })
}

//show logout button on click on profile img
profileImg.addEventListener('click', function () {
  logoutCard.classList.toggle('hidden')
})

//logout functionality
logoutBtn.addEventListener('click', function () {
  swal({
    title: '',
    text: 'Do you want to logout?',
    icon: 'warning',
    button: 'confirm',
  }).then(() => {
    signOut(auth)
      .then(() => {
        window.location = './index.html'
      })
      .catch((error) => {
        console.log(error)
      })
  })
})

sendBtn.addEventListener('click', () => {
  let message = document.querySelector('#chat')
  console.log(currentUser.userId)
  console.log(currentUser.username)
  let chatDoc = {
    chatValue: message.value,
    userUid: currentUser.userId,
    username: currentUser.username,
    time: new Date().getTime(),
  }
  addDoc(collection(db, 'chats'), chatDoc)
    .then((res) => {
      console.log(res)
      message.value = ''
    })
    .catch((err) => {
      console.log(err)
    })
  console.log(chatDoc)
})
