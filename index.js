// variables
const categoriesSelector = document.getElementById('categories')
const questionQuantity = document.getElementById('questionQuantity')
const difficulty = document.getElementById('difficulty')
const questionType = document.getElementById('questionType')
const startTest = document.getElementById('startTest')
const container = document.getElementById('container')
const testContainer = document.getElementById('test')
const empty = 'empty-page'
const finishTest = document.getElementById('finishTest')

// requesting categories json file
function getRequest(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open('get', url)
        xhr.onload = function () {
            resolve(this.responseText)
        }
        xhr.onerror = function () {
            reject('error')
        }
        xhr.send()
    })
}
getRequest('https://opentdb.com/api_category.php')
    .then(function (response) {
        let objects = JSON.parse(response)
        objects.trivia_categories.forEach(element => {
            optionCreator(element)
        })
    })
// Options for selecting categories are generated
function optionCreator(object) {
    let option = document.createElement('option')
    option.value = object.id
    option.text = object.name
    return categoriesSelector.appendChild(option)
}
// generate new url
startTest.addEventListener('click', () => {
    let newUrl = `https://opentdb.com/api.php?amount=${questionQuantity.value}${categoriesSelector.value !== 'any' ? `&category=${categoriesSelector.value}` : ''}${difficulty.value !== 'any' ? `&difficulty=${difficulty.value}` : ''}${questionType.value !== 'any' ? `&type=${questionType.value}` : ''} `
    let startTest = 'start-test'
    container.className = empty
    finishTest.className = startTest
    // send a request for test questions
    getRequest(newUrl).then(function (response) {
        let testInfo = JSON.parse(response)
        answersCheck(testInfo.results)
    })
})
// checking answer from url
function answersCheck(response) {
    if (response.length !== 0) {
        testMaker(response)
    } else {
        let text = 'Sorry, the test could not be found. Try again'
        showResult(text,'')
        finishTest.className = empty
    }
}
// calling test creator function
function testMaker(array) {
    let testWrapper = document.getElementById('testWrapper')
    finishTest.addEventListener('click', () => {
        checkAnswers(array)
        testWrapper.className = empty
        finishTest.className = empty
    })
    array.forEach(test => {
        createList(test)
    })
}
// create html li tags with questions 
// and adding correct answer randomly in array with incorrect answers
function createList(test) {
    let list = document.createElement('li')
    list.className = 'question'
    list.innerHTML = test.question
    let question = testContainer.appendChild(list)
    let answerArray = test.incorrect_answers
    if (test.incorrect_answers.length > 2){
        let random = Math.floor((Math.random() * 4))
        answerArray.splice(random, 0, test.correct_answer)
        createAnswer(test, answerArray, question)
    }
    else{
        let booleanRandom = Math.floor(Math.random()*2)
        answerArray.splice(booleanRandom, 0, test.correct_answer)
        createAnswer(test, answerArray, question)
    }
}
// adding answers in html dom
function createAnswer(test, e, question) {
    input = document.getElementById('input')
    e.forEach(array => {
        let newDiv = document.createElement('div')
        let label = document.createElement('label')
        label.type = "radio"
        label.name = test.question
        label.className = 'incorrect_answers'
        label.innerHTML = array
        question.appendChild(newDiv)
        createInput(test, array, question)
        question.appendChild(label)
    })
}
// adding inputs to check answers
function createInput(test, value, tester) {
    let input = document.createElement('input')
    input.type = 'radio'
    input.name = test.question
    input.className = test.question
    input.value = value
    tester.appendChild(input)
}

// checking answers and counting Result
function checkAnswers(array) {
    let selected = document.querySelectorAll('li > input')
    let i = 0
    let point = 0
    let text = 'total number of your points is '
    selected.forEach(input => {
        if (input.className == array[i].question) {
            if (input.checked) {
                if (input.value === array[i].correct_answer)point += 1
                else return point
            } else {
                return point
            }
        } else {
            i += 1
            if (input.checked) {
                if (input.value === array[i].correct_answer) point += 1
                else  return point
            } else { 
                return point
            }
        }
    })
    showResult(text, point)
}

function showResult( text, point) {
    let div = document.createElement('div')
    let a = document.createElement('a')
    div.innerHTML =  `${text} ${point}`
    div.className = 'title'
    let addedDiv = document.body.appendChild(div)
    a.innerHTML = 'retry'
    a.href = './index.html'
    a.className = 'retry' 
    addedDiv.appendChild(a)
}
