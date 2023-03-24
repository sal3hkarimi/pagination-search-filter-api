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


btnPages = (number) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    li.classList.add('btn-li')
    a.classList.add('btn')
    a.textContent = number
    li.appendChild(a)
    return li
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
    url: 'https://jsonplaceholder.typicode.com/todos',
    currentPage: 1,
    numberPages: 15
}


const todoApi = (url) => {
    let data = fetch(url)
        .then(res => res.json())
        .then(json => {
            converToPagination(json)

            search(json)
            return json;
        })


    return data
}

todoApi(state.url)


function changeState(number, json) {
    state.currentPage = number
    converToPagination(json)
    state.currentPage = 1
}

function converToPagination(json) {
    let todos = pagination(json, state.numberPages)
    let todosElement = ""

    json.length ? todos[state.currentPage - 1].map(e => {
        todosElement += todo(e.title, e.completed)
    }) : todosElement
    todoBox.innerHTML = todosElement

    btnPagination.innerHTML = ''
    todos.forEach((t, index) => {
        const btnPage = btnPages(index + 1)
        btnPagination.appendChild(btnPage)
        // if(!Object.values(btnPagination.children).map(e=>e.outerHTML).includes(btnPage.outerHTML)){
        // }
    })
    const btns = document.getElementsByClassName('btn-li')
    Object.values(btns).map((e, index) => {
        e.addEventListener('click', (e) => changeState(index + 1, json))
    })
    // .addEventListener('click', () => changeState(index + 1))

    // search(json)

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


function search(json) {
    inputSearch.addEventListener('keyup', (evn) => {
        const searchList = json.filter(e => e.title.includes(evn.target.value))
        evn.key === 'Backspace' ? converToPagination(json) : converToPagination(searchList)
    })
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
            allAuthor.addEventListener('click', () => todoApi(state.url).then(json => converToPagination(json)))
            author.addEventListener('click', (e) => {
                todoApi(state.url)
                    .then(json => {
                        const id = e.target.dataset.id
                        const autherTodo = json.filter(u => u.userId === parseInt(id))
                        converToPagination(autherTodo)
                    })
            })

        })
    })

