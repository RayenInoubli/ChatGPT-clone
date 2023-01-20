/*import bot from './assets/bot.png'
import user from './assets/user.png'*/

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = ''
    }
  }, 300)

}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++;
    } else {
      clearInterval(interval)
    }
  }, 20)
}

function generateUniqueId() {
  const timeStamp = Date.now()
  const randomNum = Math.random();
  const hexaString = randomNum.toString(16)

  return `id-${timeStamp}-${hexaString}`
}

function chatStripe(isAi, value, uniqueId) {

    //create wrapper
    var wrapper = document.createElement('div')
    wrapper.className = `wrapper ${ isAi ? 'ai' : '' }`

    //create chat
    var chat = document.createElement('div')
    chat.className = "chat"

    //create profile
    var profile = document.createElement('div')
    profile.className = "profile"

    var image = document.createElement('div')
    image.id =  isAi ? 'bot' : 'user' 
    image.innerHTML = isAi ? 'bot' : 'user' 

    //create message
    var message = document.createElement('div')
    message.className = "message"
    message.id = uniqueId
    message.innerHTML = value

    //append wrapper
    chatContainer.appendChild(wrapper);
    //append chat
    wrapper.appendChild(chat)
    //append profile
    chat.appendChild(profile)
    //append message
    chat.appendChild(message)
    //append image
    profile.appendChild(image)
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user query
  chatContainer.innserHTML += chatStripe(false, data.get('prompt'))

  form.reset();

  //chatbot answer
  const uniqueId = generateUniqueId();

  chatContainer.innserHTML += chatStripe(true, " ", uniqueId)
  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv)

  //fstch data from server
//http://localhost:5000 https://chatclone-vhak.onrender.com
  const response = await fetch("https://chatclone-vhak.onrender.com", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = ''

  if (response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim()

    typeText(messageDiv, parsedData)
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "something went wrong";

    alert(err);
  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})