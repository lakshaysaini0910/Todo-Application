const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const remainingCount = document.getElementById("remaining-count")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const allFilterBtn = document.getElementById("allFilterBtn")
const activeFilterBtn = document.getElementById("activeFilterBtn")
const completedFilterBtn = document.getElementById("completedFilterBtn")

let todoText; // This should be populated when the user clicks on Add button
let todos = [];
let todosString = localStorage.getItem("todos")
// If we have todos in the localStorage, we will read it
if (todosString) {
    todos = JSON.parse(todosString);
    remainingCount.innerHTML = todos.filter((item) => { return item.isCompleted !== true }).length
}

let filter = "all"

const populateTodos = (todosToDisplay = todos) => {
    let string = "";
    for (const todo of todosToDisplay) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""} >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`
    }
    todoListUl.innerHTML = string


    // Add the checkbox logic to populate todos
    const todoCheckboxes = document.querySelectorAll(".todo-checkbox")

    todoCheckboxes.forEach((element) => {
        element.addEventListener("click", (e) => {
            if (e.target.checked) {
                element.parentNode.classList.add("completed")
                // Grab this todo from todos array and update the todos array to set this todo's isCompleted attribute as true
                todos = todos.map(todo => {
                    if (todo.id === element.parentNode.id) {
                        return { ...todo, isCompleted: true }
                    }
                    else {
                        return todo
                    }
                })
                remainingCount.innerHTML = todos.filter((item) => { return item.isCompleted !== true }).length
                localStorage.setItem("todos", JSON.stringify(todos))
                refreshTodos()
            }
            else {
                element.parentNode.classList.remove("completed")
                // Grab this todo from todos array and update the todos array to set this todos isCompleted attribute as false
                todos = todos.map(todo => {
                    if (todo.id === element.parentNode.id) {
                        return { ...todo, isCompleted: false }
                    }
                    else {
                        return todo
                    }
                })
                remainingCount.innerHTML = todos.filter((item) => { return item.isCompleted !== true }).length
                localStorage.setItem("todos", JSON.stringify(todos))
                refreshTodos()
            }
        })
    })





    // Handle the delete buttons
    const deleteBtns = document.querySelectorAll(".delete-btn")

    deleteBtns.forEach((element) => {
        element.addEventListener("click", (e) => {
            const confirmation = confirm("Are you sure you want to delete this todo?")
            if (!confirmation) return
            console.log(e.target.parentNode.id)
            todos = todos.filter((todo) => {
                return todo.id !== (e.target.parentNode.id)
            })
            remainingCount.innerHTML = todos.filter((item) => { return item.isCompleted !== true }).length
            localStorage.setItem("todos", JSON.stringify(todos))
            refreshTodos()
        })
    })

}

clearCompletedBtn.addEventListener("click", () => {
    const confirmation = confirm("Are you sure you want to delete this todo?")
    if (!confirmation) return
    todos = todos.filter((todo) => {
        return !todo.isCompleted
    })
    localStorage.setItem("todos", JSON.stringify(todos))
    refreshTodos()
})



addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value
    if (todoText.trim().length < 4) {
        alert("Can't add a todo with less than 4 characters")
        return
    }
    inputTag.value = ""
    const todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    }
    todos.push(todo)
    remainingCount.innerHTML = todos.filter((item) => { return item.isCompleted !== true }).length
    localStorage.setItem("todos", JSON.stringify(todos))
    refreshTodos()
})

populateTodos()

const refreshTodos = () => {
    if (filter === "all") {
        populateTodos(todos);
    }
    else if (filter === "active") {
        const activeTodos = todos.filter(todo => !todo.isCompleted);
        populateTodos(activeTodos);
    }
    else if (filter === "completed") {
        const completedTodos = todos.filter(todo => todo.isCompleted);
        populateTodos(completedTodos);
    }
}

const removeActiveFilter = () => {
    document.querySelectorAll(".filter-btn").forEach((element) => {
        element.classList.remove("active")
    })
}

allFilterBtn.addEventListener("click", () => {
    removeActiveFilter();
    allFilterBtn.classList.add("active")
    filter = "all";
    refreshTodos();
});

activeFilterBtn.addEventListener("click", () => {
    removeActiveFilter();
    activeFilterBtn.classList.add("active")
    filter = "active";
    refreshTodos();
});

completedFilterBtn.addEventListener("click", () => {
    removeActiveFilter();
    completedFilterBtn.classList.add("active")
    filter = "completed";
    refreshTodos();
});
