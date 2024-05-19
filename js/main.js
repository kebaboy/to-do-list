import { Storage } from "./managers/Storage.js";



const TASKS_URL = "json/tasks.json";
const taskList = document.querySelector(".tasks__list");
// window.onload
async function uploadTasks() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // let response = await fetch(TASKS_URL);
    // let tasks = await response.json();
    const tasks = Storage.getTasks();
    console.log(tasks);
    tasks.forEach(taskObj => {
        let task = createTask(taskObj);
        taskList.append(task);
    })
}




const date = document.querySelector(".to-do-list__day-month-year");
const time = document.querySelector(".to-do-list__time");

function updateTimeAndDate() {
    let dateObj = new Date();
    date.textContent = ['0'+dateObj.getDate(), '0'+(dateObj.getMonth()+1), ''+dateObj.getFullYear()].map(item => item.slice(-2)).join(".");
    time.textContent = ['0'+dateObj.getHours(), '0'+(dateObj.getMinutes())].map(item => item.slice(-2)).join(":");
}

setInterval(updateTimeAndDate, 60000);
updateTimeAndDate();


const addTaskPopup = document.getElementById("add-task-popup");
const editTaskPopup = document.getElementById("edit-task-popup");
const taskInput = document.querySelector(".add-task__input");
const completedTaskList = document.querySelector(".completed-tasks__list");
const completedTasks = completedTaskList.getElementsByClassName("task");
const completedTasksCount = document.querySelector(".completed-tasks__title");

const DESC_MAX_LENGTH = 73;


document.addEventListener("DOMContentLoaded", function() {
    uploadTasks().finally(() => {
        taskList.querySelector(".loader").style.display = "none";
        taskInput.closest(".add-task").classList.add("visible");
        date.closest(".to-do-list__date").classList.add("visible");
        document.querySelector(".tasks__title").classList.add("visible");
    })
})

function addTask() {
    if (taskInput.value.trim() !== "") {
        const taskObj = {id: Storage.generateTaskId(), title: taskInput.value}; 
        const task = createTask(taskObj);
        taskList.append(task);
        Storage.addTask(taskObj);
        taskInput.value = "";
    } else {
        openPopup(addTaskPopup);
    }
}

// просто task object передаем
function createTask({id, title, description = "", date = "no-date"}) {
    const task = document.createElement("li");
    task.classList.add("tasks__task", "task", "open-popup");
    task.dataset.popup = "edit-task-popup";
    task.draggable = true;

    const header = document.createElement("div");
    header.classList.add("task__header");

    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task__title");
    taskTitle.textContent = title;

    const taskDate = document.createElement("div");
    taskDate.classList.add("task__date");
    taskDate.textContent = date;
    if (date === "no-date") taskDate.classList.add("display-none");

    const taskDeleteButton = document.createElement("button");
    taskDeleteButton.classList.add("task__delete-btn");
    taskDeleteButton.textContent = "✓";
    taskDeleteButton.onclick = function() {
        taskDeleteButton.closest(".task__header").classList.add("deleted");
        setTimeout(function() {
            const task = taskDeleteButton.closest(".task");
            console.log(id);
            Storage.removeTask(id);
            taskDeleteButton.closest(".task").remove();
            completedTaskList.append(task);
            const count = completedTasks.length;
            completedTasksCount.textContent = `Completed (${count})`;

        }, 800)
    }
    header.append(taskTitle, taskDate, taskDeleteButton);

    const footer = document.createElement("div");
    footer.classList.add("task__footer");

    const taskDescriptionReduced = document.createElement("div");
    taskDescriptionReduced.classList.add("task__description-reduced");
    taskDescriptionReduced.textContent = description;

    const taskDescription = document.createElement("div");
    taskDescription.classList.add("task__description");
    if (description.length > DESC_MAX_LENGTH) {
        taskDescription.textContent = description.slice(0, DESC_MAX_LENGTH + 1) + "...";
    } else {taskDescription.textContent = description}


    footer.append(taskDescription);
    footer.append(taskDescriptionReduced);
    if (taskDescription.textContent === '') footer.classList.add("display-none");

    task.append(header, footer);


    task.addEventListener("click", function(e) {
        if (!e.target.classList.contains('task__delete-btn')) {
            editTask(task);
        }
    });
    task.addEventListener("dragstart", (event) => {
        draggedItem = event.target;
    });
    task.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
    task.addEventListener("drop", (event) => {
        if (draggedItem) {
            event.preventDefault();
            const targetItem = event.target.closest('li');
            if (targetItem && targetItem !== draggedItem) {
                const targetIndex = Array.from(taskList.children).indexOf(targetItem);
                const draggedIndex = Array.from(taskList.children).indexOf(draggedItem);
                if (targetIndex > draggedIndex) {
                    taskList.insertBefore(draggedItem, targetItem.nextSibling);
                } else {
                    taskList.insertBefore(draggedItem, targetItem);
                }
            }
            draggedItem = null;
        }
    });

    return task;
}

function createCompletedTask(title) {
    const task = document.createElement("li");
    task.textContent = title;
    task.classList.add("completed-tasks__task");
    return task;
}


function editTask(openElement) {
    openElement.classList.add("selected");
    constructPopup(openElement);
    openPopup(editTaskPopup);
}

let draggedItem = null;

const openElements = document.querySelectorAll(".open-popup");
for (const openElement of openElements) {
    const targetPopupId = openElement.dataset.popup;
    if (targetPopupId === "add-task-popup") {
        openElement.addEventListener("click", addTask);
    } else if (targetPopupId === "edit-task-popup") {
        openElement.addEventListener("click", (event) => {
            if (!event.target.classList.contains('task__delete-btn')) {
                editTask(openElement);
            }
        });
        openElement.addEventListener("dragstart", (event) => {
            draggedItem = event.target;
        });
        openElement.addEventListener("dragover", (event) => {
            event.preventDefault();
        })
        openElement.addEventListener("drop", (event) => {
            if (draggedItem) {
                event.preventDefault();
                const targetItem = event.target.closest('li');
                if (targetItem && targetItem !== draggedItem) {
                    const targetIndex = Array.from(taskList.children).indexOf(targetItem);
                    const draggedIndex = Array.from(taskList.children).indexOf(draggedItem);
                    if (targetIndex > draggedIndex) {
                        taskList.insertBefore(draggedItem, targetItem.nextSibling);
                    } else {
                        taskList.insertBefore(draggedItem, targetItem);
                    }
                }
                draggedItem = null;
            }
        });
    } else {
        openElement.addEventListener("click", () => openPopup(document.getElementById(`${targetPopupId}`)));
    }
}




function constructPopup(task) {
    editTaskPopup.querySelector(".popup__task-title").value = task.querySelector(".task__title").textContent;
    editTaskPopup.querySelector(".popup__task-description").value = task.querySelector(".task__description-reduced").textContent;
    let activeOption = null;
    try {
        activeOption = editTaskPopup.querySelector(`#${task.querySelector(".task__date").textContent}`);
    } catch {
    }
    
    console.log(activeOption);
    if (activeOption) {
        activeOption.classList.add("active");
        console.log(activeOption.id);
    } else editTaskPopup.querySelector(".popup__calendar").value = task.querySelector(".task__date").textContent;
    // editTaskPopup.querySelector(`#${task.querySelector(".task__date").textContent}`).classList.add("active");
}


function openPopup(currentPopup) {
    const closeElements = currentPopup.querySelectorAll(".close-popup");
    for (const closeElement of closeElements) {
        if (closeElement.id === "add-task-popup-btn") closeElement.addEventListener("click", addTaskHandler);
        else if (closeElement.id === "edit-task-popup-btn") closeElement.addEventListener("click", editTaskHandler);
        else closeElement.addEventListener("click", closePopupHandler);
    }
    // ?.
    const datePicker = currentPopup.querySelector(".popup__date-options"); 
    if (datePicker) datePicker.addEventListener("click", pickDateHandler);
    const dateInput = currentPopup.querySelector(".popup__calendar");
    if (dateInput) dateInput.addEventListener("change", () => clearDateOptions(datePicker));
    if (currentPopup.id === "edit-task-popup") {
        currentPopup.querySelector(".active")?.click();
    }
    
    currentPopup.classList.add("open");
    currentPopup.addEventListener("mousedown", outsidePopupClickHandler)
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setInputDate(targetDateBtn) {
    const id = targetDateBtn.id;
    const input = targetDateBtn.closest(".popup").querySelector(".popup__calendar");
    switch(id) {
        case 'today':
            input.value = formatDate(new Date());
            break;
        case 'tomorrow':
            const date = new Date();
            date.setDate(date.getDate() + 1)
            input.value = formatDate(date);
            break;
        case 'no-date':
            input.value = '';
            break;
    }
}

function clearDateOptions(datePicker) {
    datePicker.querySelector(".active")?.classList.remove("active");
}

function pickDateHandler(e) {
    const activeDateBtn = e.target.closest(".popup__date-options").querySelector(".active");
    if (activeDateBtn) activeDateBtn.classList.remove("active");
    const targetDateBtn = e.target;
    setInputDate(targetDateBtn);
    targetDateBtn.classList.add("active");
}

function outsidePopupClickHandler(e) {
    if (!e.target.closest(".popup__content")) {
        closePopup(this);
        this.removeEventListener("mousedown", outsidePopupClickHandler);
    }
}

function closePopupHandler(event) {
    const popup = event.target.closest(".popup");
    if (popup) closePopup(popup);
}

function validateTask(event) {
    const taskTitle = event.target.closest(".popup__content").querySelector(".popup__task-title");
    if (!taskTitle.value.trim()) {
        taskTitle.classList.add("error");
        return false;
    } else return true;
}

function addTaskHandler(event) {
    if (!validateTask(event)) return;
    const taskTitle = addTaskPopup.querySelector(".popup__task-title");
    const taskDescription = addTaskPopup.querySelector(".popup__task-description");
    const taskDate = addTaskPopup.querySelector(".popup__calendar");
    const taskObj = {id: Storage.generateTaskId(), title: taskTitle.value, description: taskDescription.value, date: addTaskPopup.querySelector(".active")?.textContent || taskDate.value};
    Storage.addTask(taskObj);
    const task = createTask(taskObj);
    // сдлеать clear либо в закрытии окна    либо здесь
    taskTitle.value = "";
    taskTitle.classList.remove("error");
    taskDescription.value = "";
    taskDate.value = "";
    addTaskPopup.querySelector(".active")?.classList.remove("active");
    addTaskPopup.querySelector("#no-date").classList.add("active");
    taskList.append(task);
    closePopupHandler(event);
}

function editTaskHandler(event) {
    if (!validateTask(event)) return;
    const selectedTask = document.querySelector(".selected");
    if (selectedTask) {
        selectedTask.querySelector(".task__title").textContent = editTaskPopup.querySelector(".popup__task-title").value;
        const descriptionReduced = selectedTask.querySelector(".task__description-reduced");
        descriptionReduced.textContent = editTaskPopup.querySelector(".popup__task-description").value;
        const description = selectedTask.querySelector(".task__description");
        if (descriptionReduced.textContent.length > DESC_MAX_LENGTH) {
            description.textContent = descriptionReduced.textContent.slice(0, DESC_MAX_LENGTH + 1) + "...";
        } else {description.textContent = descriptionReduced.textContent}
        description.textContent.trim() ? description.closest(".task__footer").classList.remove("display-none") : description.closest(".task__footer").classList.add("display-none");
    
        const dateBtn = editTaskPopup.querySelector(".active");
        if (dateBtn) {
            selectedTask.querySelector(".task__date").textContent = dateBtn.textContent;
            if (dateBtn.textContent !== "no-date" & selectedTask.querySelector(".task__date").classList.contains("display-none")) {
                selectedTask.querySelector(".task__date").classList.remove("display-none");
            } else if (dateBtn.textContent === "no-date" & !selectedTask.querySelector(".task__date").classList.contains("display-none")) {
                selectedTask.querySelector(".task__date").classList.add("display-none");
            }
            selectedTask.classList.remove("selected");   
        } else selectedTask.querySelector(".task__date").textContent = editTaskPopup.querySelector(".popup__calendar").value;
    }
    closePopupHandler(event);
}


function closePopup(currentPopup) {
    currentPopup.classList.remove("open");
    currentPopup.querySelector(".popup__task-title").classList.remove("error");

    const closeElements = currentPopup.querySelectorAll(".close-popup");
    for (const closeElement of closeElements) {
        if (closeElement.id === "add-task-popup-btn") {
            closeElement.removeEventListener("click", addTaskHandler);
            closeElement.blur();
        }
        if (closeElement.id === "edit-task-popup-btn") closeElement.removeEventListener("click", editTaskHandler);
        else closeElement.removeEventListener("click", closePopupHandler);
    }
    if (currentPopup.id === "edit-task-popup") {
        currentPopup.querySelector(".popup__date-options").removeEventListener("click", pickDateHandler);
        currentPopup.querySelector(".popup__calendar").removeEventListener("click", clearDateOptions);
        currentPopup.querySelector(".active")?.classList.remove("active");
        const selectedTask = document.querySelector(".selected");
        if (selectedTask) selectedTask.classList.remove("selected");
    }
    if (currentPopup.id === "add-task-popup") {
        // поч здесь обнуляем только когда таска добавляется
        currentPopup.querySelector(".popup__date-options").removeEventListener("click", pickDateHandler);
        currentPopup.querySelector(".popup__calendar").removeEventListener("click", clearDateOptions);
    }
    currentPopup.removeEventListener("mousedown", outsidePopupClickHandler);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !addTaskPopup.classList.contains("open")) {
        addTask();
    }
})

const completedTaskHeader = document.querySelector(".completed-tasks__header");

completedTaskHeader.addEventListener("click", () => {
    const symbol = completedTaskHeader.querySelector("span");
    symbol.textContent = symbol.textContent === "+" ? "-" : "+";
    completedTaskList.classList.toggle("show");
})
