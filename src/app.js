import {Question} from './question'
import './styles.css'
import {createModal, isValid} from "./utils"
import {authWithEmailAndPassword, getAuthForm} from "./auth";

const modalBtn = document.getElementById('modal-btn')
const form = document.getElementById('form')
const input = form.querySelector('#question-input')
window.addEventListener('load', Question.renderList)

const submitBtn = form.querySelector('#submit')
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            data: new Date().toJSON()
        }
        submitBtn.disabled = true
        //Async request to server to save question
        Question.create(question)
            .then(() => {
                input.value = ''
                input.className = ''
                submitBtn.disabled = false
            })
            .catch(error => {
                console.error("Error while saving the question:", error)
                submitBtn.disabled = false
            })
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document.getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Error' , content)
    }else {
        createModal('Список вопросов', Question.listToHtml(content))
    }
}