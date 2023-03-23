const todoBox = document.querySelector('.todo-box')
const btnPagination = document.querySelector('.btn-pagination ul')
const inputSearch = document.querySelector('.search')

const todo = (text, check) => {
    return (`
    <div class="todo">
        <input type="checkbox" ${check ? 'checked' : null}>
        <p class="todo-text">${text}</p>
    </div>
    `)
}


const btn = (number) => {
    const li = document.createElement('li')
    const link = document.createElement('link')
    return (`
        <li><a class="btn" onClick="changeState(${number})" href="#">${number}</a></li>
    `)
}

const state = {
    currentPage: 1,
    numberPages: 15
}


const api = (url) => {
    let data = fetch(url)
        .then(res => res.json())
        .then(json => {
            converToPagination(json)
            inputSearch.addEventListener('keyup', (e) => {
                const searchList = search(json, e.target.value)
                converToPagination(searchList)
            })
        })


    return data
}

api('https://jsonplaceholder.typicode.com/todos')


function changeState(number) {
    state.currentPage = number
    api('https://jsonplaceholder.typicode.com/todos')
}

function converToPagination(json) {
    let todos = pagination(json, state.numberPages)
    let todosElement = ``
    json.length ? todos[state.currentPage - 1].map(e => {
        todosElement += todo(e.title, e.completed)
    }) : todosElement
    todoBox.innerHTML = todosElement

    let btns = ""
    todos.forEach(t => {
        btns += btn(todos.indexOf(t) + 1)
    })
    btnPagination.innerHTML = btns
}

function pagination(data, ItemsPage) {
    const curentPage = 1
    const activeItemPage = ItemsPage;
    const lastPage = data.length
    const listPage = [0, lastPage]
    const pageData = []

    for (count = curentPage; count < lastPage; count++) {
        if (count % activeItemPage === 0) {
            listPage.push(count)
        }
    }

    listPage.sort((a, b) => a - b)

    for (let index = 0; index < listPage.length; index++) {
        let listTmp = []
        for (let num = listPage[index]; num < listPage[index + 1]; num++) {
            listTmp.push(data[num])
        }
        listTmp.length ? pageData.push(listTmp) : null
        listTmp = []
    }
    return pageData
}


function search(array, text) {
    const findList = array.filter(e => e.title.includes(text))
    return findList
}
