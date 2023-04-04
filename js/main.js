// Нахождение элементов на странице
const form = document.querySelector('#form');   // форма отправки
const taskInput = document.querySelector('#taskInput'); // поле ввода задачи
const tasksList = document.querySelector('#tasksList'); // список задач
const emptyList = document.querySelector('#emptyList'); // список задач пуст

// Массив с задачами
let tasks = [];

// Проверка наличия данных в LocalStorage
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));

    // Отображение данных из LocalStorage на странице
    tasks.forEach((task) => renderTask(task));
}


checkEmptyList();


// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу выполненной
tasksList.addEventListener('click', doneTask);


// Функция добавления задач
function addTask(event) {
    // Отмена стандартного поведения (перезагрузки страницы при отправке формы)
    event.preventDefault();
    
    // Достаём текст задачи из поля ввода
    const taskText = taskInput.value;

    // Объект описывающий задачу
    const newTask = {
        id: Date.now(),     // id - текущее время в мс.
        text: taskText,
        done: false
    };

    // Добавление объекта в массив с задачами
    tasks.push(newTask);

    // Сохраняем список задач в хранилище браузера
    saveToLocalStorage();

    // Добавляем задачу на страницу
    renderTask(newTask);

    // Очищаем поле ввода и возвращаем фокус на него
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

// Функция удаления задач
function deleteTask(event) {
    // Проверка что клик был по кнопке "Удалить задачу"

    // Если клик был НЕ по кнопке "Удалить задачу"
    if (event.target.dataset.action !== 'delete') {
        return;     // выход из функции
    } 
   
    // Ищем родительский класс в котором находится кнопка delete
    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);

/*  // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id);

    // Удаление задачи из массива с задачами
    tasks.splice(index, 1); */

    // Удаление задачи через фильтр массива
    tasks = tasks.filter((task) => task.id !== id);

    // Сохраняем список задач в хранилище браузера
    saveToLocalStorage();
        
    // Удаляем задачу со страницы
    parentNode.remove();

    checkEmptyList();
}

// Функция выполнения задач
function doneTask(event) {
    // Проверяем что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    // Получение ID задачи
    const id = Number(parentNode.id);

    // Поиск задачи в массиве с задачами
    const task = tasks.find((task) => task.id === id);

    // Меняется статус задачи в массиве на обратный (done: false на done: true)
    task.done = !task.done;

    // Сохраняем список задач в хранилище браузера
    saveToLocalStorage();
        
    // находим класс, в котором затемняем и зачёркиваем выполненную задачу
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done'); // двойной клик - возвращает задачу
}

// Функция проверки массива на заполненность
function checkEmptyList() {
    // Если массив пустой
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    // Если в массиве есть элементы
    if (tasks.length > 0) {
        const emptyListElement = document.querySelector('#emptyList');

        (emptyListElement) ? emptyListElement.remove() : null;
    }
}

// Функция сохранения массива в LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для разметки добавления задачи на странице
function renderTask(task) {
    // Формируем CSS-класс для выполненной/невыполненной задачи
    const cssClass = (task.done) ? 'task-title task-title--done' : 'task-title';

    // Формируем разметку для новой задачи
    const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>`;

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}