const todoBox = document.querySelector('.todo-box')
const btnPagination = document.querySelector('.btn-pagination ul')
const inputSearch = document.querySelector('.search')
const userList = document.getElementById('users')


const todo = (text, check) => {
    return (`
    <div class="todo">
        <input type="checkbox" ${check ? 'checked' : null}>
        <p class="todo-text">${text}</p>
    </div>
    `)
}


const btn = (number) => {
    return (`
        <li><a class="btn" onClick="changeState(${number})" href="#">${number}</a></li>
    `)
}


const userTag = (name, id) => {
    const option = document.createElement("option");
    option.setAttribute("class", "author");
    option.setAttribute("data-id", id);
    option.textContent = name
    return option
}
const allAuthor = userTag('All', 0)
userList.appendChild(allAuthor)



const state = {
    currentPage: 1,
    numberPages: 15
}


const todoApi = (url) => {
    let data = fetch(url)
        .then(res => res.json())
        .then(json => {
            converToPagination(json)
            inputSearch.addEventListener('keyup', (e) => {
                const searchList = search(json, e.target.value)
                converToPagination(searchList)
            })






            return json;

        })


    return data
}

todoApi('https://jsonplaceholder.typicode.com/todos')


function changeState(number) {
    state.currentPage = number
    todoApi('https://jsonplaceholder.typicode.com/todos')
}

function converToPagination(json) {
    let todos = pagination(json, state.numberPages)
    let todosElement = ""
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


userApi = (url) => {
    let data = fetch(url)
        .then(response => response.json())
        .then(json => json)
    return data
}

userApi('https://jsonplaceholder.typicode.com/users')
    .then(dataUser => {
        dataUser.forEach(({ name, id }) => {
            const author = userTag(name, id)
            userList.appendChild(author)
            todoApi('https://jsonplaceholder.typicode.com/todos')
                .then(json => {
                    allAuthor.addEventListener('click', () => converToPagination(json))
                    author.addEventListener('click', (e) => {
                        const id = e.target.dataset.id
                        const autherTodo = json.filter(u => u.userId === parseInt(id))
                        converToPagination(autherTodo)
                    })
                })

        })
    })
