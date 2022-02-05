const socket = io()

fetch('/getUser').then(async (data) => {
  const nombre = await data.text()
  const divPresentation = document.getElementById('presentation')
  divPresentation.innerHTML = `Bienvenido ${nombre}`
})

let logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', (e) => {
  fetch('/logout').then(response => {
    window.location.replace('/login.html')
  })
})

const authorSchema = new normalizr.schema.Entity('authors', {}, {
  idAttribute: 'email'
})

const messageSchema = new normalizr.schema.Entity('messages', {
  author: authorSchema,
});

const conversationSchema = new normalizr.schema.Entity('conversations', {
  message: messageSchema,
});

const inputMessage = document.getElementById('message')
const inputEmail = document.getElementById('email')
const inputName = document.getElementById('name')
const inputMiddle = document.getElementById('middle')
const inputEdad = document.getElementById('edad')
const inputAlias= document.getElementById('alias')
const inputPhotoURL= document.getElementById('photoURL')

document.getElementById('button-message').addEventListener('click', () => {
  let today = new Date()
  let timeMessage = today.getFullYear() + '/' + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                    today.getDate().toString().padStart(2, '0') + ' ' + 
                    today.getHours().toString().padStart(2, '0') + ":" + 
                    today.getMinutes().toString().padStart(2, '0') + ":" + 
                    today.getSeconds().toString().padStart(2, '0')
  socket.emit('updateMessages', {
    'id': (Math.ceil(Math.random() * 100000000)).toString(),
    'message': inputMessage.value, 
    'time': timeMessage,
    'author': {
      'email': inputEmail.value, 
      'name': inputName.value, 
      'middle': inputMiddle.value, 
      'edad': inputEdad.value, 
      'alias': inputAlias.value, 
      'photoURL': inputAlias.value, 
    },
  })
})

socket.on('messages', (payload) => {
  console.log(JSON.stringify(payload))
  const conversation = normalizr.denormalize(payload.normConv.result, conversationSchema, payload.normConv.entities);
  console.log(conversation)
  const htmlMessage = conversation.messageList
                        .map(msg => `${msg.author.email} [${msg.time}]: ${msg.message}`)
                        .join('<br/>')
  document.getElementById('messages').innerHTML = htmlMessage
  document.getElementById('compression').innerHTML = Math.ceil(payload.porcentajeC)
})