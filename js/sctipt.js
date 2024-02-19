const taskList = document.querySelector(".tasks__list");
const addTaskPopup = document.getElementById("add-task-popup");
const editTaskPopup = document.getElementById("edit-task-popup");
const taskInput = document.querySelector(".add-task__input")

function addTask() {
    if (taskInput.value.trim() !== "") {
        const task = createTask(taskInput.value);
        taskList.append(task);
        taskInput.value = "";
    } else {
        openPopup(addTaskPopup);
    }
}


function createTask(inputValue, descriptionValue = "", dateValue = "no-date") {
    const task = document.createElement("li");
    task.classList.add("tasks__task", "task", "open-popup");
    task.dataset.popup = "edit-task-popup";

    const header = document.createElement("div");
    header.classList.add("task__header");

    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task__title");
    taskTitle.textContent = inputValue;

    const taskDate = document.createElement("div");
    taskDate.classList.add("task__date");
    taskDate.textContent = dateValue;
    if (dateValue === "no-date") taskDate.classList.add("display-none");

    const taskDeleteButton = document.createElement("button");
    taskDeleteButton.classList.add("task__delete-btn");
    taskDeleteButton.textContent = "X";
    taskDeleteButton.onclick = function() {
        taskDeleteButton.closest(".task__header").classList.add("deleted");
        setTimeout(function() {
            taskDeleteButton.closest(".task").remove();
        }, 800)
    }
    header.append(taskTitle, taskDate, taskDeleteButton);

    const footer = document.createElement("div");
    footer.classList.add("task__footer");

    const description = document.createElement("div");
    description.classList.add("task__description");
    description.textContent = descriptionValue;

    footer.append(description);

    task.append(header, footer);
    task.addEventListener("click", function(e) {
        if (!e.target.classList.contains('task__delete-btn')) {
            task.classList.add("selected");
            const popup = document.getElementById("edit-task-popup");
            constructPopup(task);
            openPopup(popup);
        }
    });

    return task;
}

function editTask(openElement) {
    openElement.classList.add("selected");
    constructPopup(openElement);
    openPopup(editTaskPopup);
}

const openElements = document.querySelectorAll(".open-popup");
for (const openElement of openElements) {
    const targetPopupId = openElement.dataset.popup;
    if (targetPopupId === "add-task-popup") {
        openElement.addEventListener("click", addTask);
    } else if (targetPopupId === "edit-task-popup") {
        openElement.addEventListener("click", () => editTask(openElement));
    } else {
        openElement.addEventListener("click", () => openPopup(document.getElementById(`${targetPopupId}`)));
    }
}



function constructPopup(task) {
    editTaskPopup.querySelector(".popup__task-title").value = task.querySelector(".task__title").textContent;
    editTaskPopup.querySelector(".popup__task-description").value = task.querySelector(".task__description").textContent;
    editTaskPopup.querySelector(`#${task.querySelector(".task__date").textContent}`).classList.add("active");
}


function openPopup(currentPopup) {
    const closeElements = currentPopup.querySelectorAll(".close-popup");
    for (const closeElement of closeElements) {
        if (closeElement.id === "add-task-popup-btn") closeElement.addEventListener("click", addTaskHandler);
        if (closeElement.id === "edit-task-popup-btn") closeElement.addEventListener("click", editTaskHandler);
        else closeElement.addEventListener("click", closePopupHandler);
    }
    const datePicker = currentPopup.querySelector(".popup__date-picker");
    if (datePicker) datePicker.addEventListener("click", pickDateHandler);
    
    currentPopup.classList.add("open");
    currentPopup.addEventListener("mousedown", outsidePopupClickHandler)
}

function pickDateHandler(e) {
    const activeDateBtn = e.target.closest(".popup__date-picker").querySelector(".active");
    if (activeDateBtn) activeDateBtn.classList.remove("active");
    e.target.classList.add("active");
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

function addTaskHandler(event) {
    const taskTitle = addTaskPopup.querySelector(".popup__task-title");
    const taskDescription = addTaskPopup.querySelector(".popup__task-description");
    const taskDate = addTaskPopup.querySelector(".active");
    const task = createTask(taskTitle.value, taskDescription.value, taskDate.textContent);
    taskTitle.value = "";
    taskDescription.value = "";
    addTaskPopup.querySelector(".active").classList.remove("active");
    addTaskPopup.querySelector("#today").classList.add("active");
    taskList.append(task);
    closePopupHandler(event);
}

function editTaskHandler(event) {
    const selectedTask = document.querySelector(".selected");
    if (selectedTask) {
        selectedTask.querySelector(".task__title").textContent = editTaskPopup.querySelector(".popup__task-title").value;
        selectedTask.querySelector(".task__description").textContent = editTaskPopup.querySelector(".popup__task-description").value;
        const dateBtn = editTaskPopup.querySelector(".active");
        selectedTask.querySelector(".task__date").textContent = dateBtn.textContent;
        if (dateBtn.textContent !== "no-date" & selectedTask.querySelector(".task__date").classList.contains("display-none")) {
            selectedTask.querySelector(".task__date").classList.remove("display-none");
        } else if (dateBtn.textContent === "no-date" & !selectedTask.querySelector(".task__date").classList.contains("display-none")) {
            selectedTask.querySelector(".task__date").classList.add("display-none");
        }
        selectedTask.classList.remove("selected");   
    }
    closePopupHandler(event);
}


function closePopup(currentPopup) {
    currentPopup.classList.remove("open");

    const closeElements = currentPopup.querySelectorAll(".close-popup");
    for (const closeElement of closeElements) {
        if (closeElement.id === "add-task-popup-btn") closeElement.removeEventListener("click", addTaskHandler);
        if (closeElement.id === "edit-task-popup-btn") closeElement.removeEventListener("click", editTaskHandler);
        else closeElement.removeEventListener("click", closePopupHandler);
    }
    if (currentPopup.id === "edit-task-popup") {
        currentPopup.querySelector(".popup__date-picker").removeEventListener("click", pickDateHandler);
        currentPopup.querySelector(".active").classList.remove("active");
    }
    if (currentPopup.id === "add-task-popup") {
        currentPopup.querySelector(".popup__date-picker").removeEventListener("click", pickDateHandler);
    }
    currentPopup.removeEventListener("mousedown", outsidePopupClickHandler);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
})
