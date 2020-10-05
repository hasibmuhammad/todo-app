// Selectors
const todoInput = document.querySelector('.todo-input');
const todoBtn = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// Functions
const addTodo = ( e ) => {
    // Prevent form submission
    e.preventDefault();
    
    // Prevent blank input
    if ( todoInput.value.length === 0 ) {
        alert("You must write something!");
        return;
    }

    // Todo Div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    
    // Todo LI Item
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    // Add to Localstorage
    // addtoLocalStorage(todoInput.value, newTodo);

    // Completed CheckMark
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>'
    completedButton.classList.add('complete-button');
    todoDiv.appendChild(completedButton);

    // To Trash Button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-button');
    todoDiv.appendChild(trashButton);

    // Append Child to the Parent
    todoList.appendChild(todoDiv);
    
    // Clear the todo input
    todoInput.value = "";

    updateLocalStorage();
}

const deleteAndCheck = ( e ) => {
    const item = e.target;

    // Delete todo item
    if ( item.classList[0] === 'trash-button' ) {
        const todo = item.parentElement;
        
        // Animate
        todo.classList.add('animate');

        // Delete after animate
        todo.addEventListener('transitionend', () => {
            todo.remove();
        });

        // Delete from localStorage
        deleteItemFromLocalStorage(todo);
    }

    // Mark as done
    if ( item.classList[0] === 'complete-button' ) {
        const todo = item.parentElement;
        todo.classList.toggle('done');

        updateLocalStorage();
    }
}

const filterTodo = ( e ) => {
    const todos = todoList.childNodes;
    todos.forEach( todo => {
        switch (e.target.value) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'done':
                if (todo.classList.contains('done')) {
                    todo.style.display = 'flex';
                }
                else{
                    todo.style.display = 'none';
                }
                break;
            case 'undone':
                if (!todo.classList.contains('done')){
                    todo.style.display = 'flex';
                }else{
                    todo.style.display = 'none';
                }
                break;
        }
    });
}

const hasItemOnLocalStorage = token => {
    let items;
    if (localStorage.getItem(token) === null) {
        items = [];    
    } else{
        items = JSON.parse( localStorage.getItem(token) );
    }
    return items;
}

const addtoLocalStorage = (todo, newTodo) => {
    const todos = hasItemOnLocalStorage('todos');
    if( !todos.includes(todo) ) {
        todos.push({
            text: todo,
            done: newTodo.parentElement.classList.contains('done')
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

const updateLocalStorage = () => {
    // const doneItems = hasItemOnLocalStorage('done');
    const todosEl = document.querySelectorAll('.todo');

    const todos = [];

    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.childNodes[0].innerText,
            done: todoEl.classList.contains('done')
        })
    });

    localStorage.setItem( 'todoList', JSON.stringify( todos ) );
}

const getItemsfromLocalStorage = () => {
    const todos = hasItemOnLocalStorage('todoList');
    todos.forEach(todo => {
        // Todo Div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        
        // Todo LI Item
        const newTodo = document.createElement('li');
        newTodo.innerText = todo.text;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);

        // Completed CheckMark
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>'
        completedButton.classList.add('complete-button');
        todoDiv.appendChild(completedButton);

        // To Trash Button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trash-button');
        todoDiv.appendChild(trashButton);

        if( todo.done ) {
            todoDiv.classList.add('done')
        }

        // Append Child to the Parent
        todoList.appendChild(todoDiv);
    });
}

const deleteItemFromLocalStorage = todo => {
    const todos = hasItemOnLocalStorage('todoList');
    const clickedItem = todo.childNodes[0].innerText;
    
    // Get the index from an array of object - depending on properties
    let index = todos.map( todo => todo.text ).indexOf(clickedItem);

    todos.splice(index, 1);
    
    localStorage.setItem('todoList', JSON.stringify(todos));

}

// Event Listeners
document.addEventListener('DOMContentLoaded', getItemsfromLocalStorage);
todoBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteAndCheck);
filterOption.addEventListener('change', filterTodo);