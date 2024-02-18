function createTask(inputValue, descriptionValue = "", dateValue = "no-date") {
    // insertadjacentText
    const task = document.createElement("li");
    task.classList.add("tasks__task", "task", "open-popup");
    task.dataset.popup = "edit-task-popup";
    task.addEventListener("click", function(e) {
        if (!e.target.classList.contains('task__delete-btn')) {
            task.classList.add("selected");
            const popup = document.getElementById("edit-task-popup");
            constructPopup(task);
            openPopup(popup);
        }
    });

    const header = document.createElement("div");
    header.classList.add("task__header");

    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task__title");
    taskTitle.textContent = inputValue;
    task.append(taskTitle);

    const taskDate = document.createElement("div");
    taskDate.classList.add("task__date");
    if (dateValue !== "no-date") taskDate.textContent = dateValue;
    else taskDate.classList.add("display-none");
    task.append(taskDate);

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

    return task;
}

function addTask() {
    const taskInput = document.querySelector(".add-task__input");

    if (taskInput.value.trim() !== "") {
        const task = createTask(taskInput.value);
        taskList.append(task);
        taskInput.value = "";
    } 
    else {
        const addTaskPopup = document.getElementById("add-task-popup");
        // addTaskPopup.querySelector(".popup__add").addEventListener("click", function HandleAddTask () {
        //     const task = createTask(addTaskPopup.querySelector(".popup__task-title").value);
        //     taskList.append(task);
        //     this.removeEventListener("click", HandleAddTask);
        // })
        openPopup(addTaskPopup);
    }
}



const taskList = document.querySelector(".tasks__list");




const animDur = 800;
let unlock = true;


const openElements = document.querySelectorAll(".open-popup");
for (let openElement of openElements) {
    if (openElement.dataset.popup === "add-task-popup") {
        openElement.addEventListener("click", addTask);
    } else if (openElement.dataset.popup === "edit-task-popup") {

        openElement.addEventListener("click", function() {
            openElement.classList.add("selected");
            const popup = document.getElementById(`${openElement.dataset.popup}`);
            constructPopup(openElement);
            openPopup(popup);
        });
    } else {
        openElement.addEventListener("click", function() {
            const popup = document.getElementById(`${openElement.dataset.popup}`);
            openPopup(popup);
        })
    }
}

// const closeElements = document.querySelectorAll(".close-popup");
// for (let closeElement of closeElements) {
//     closeElement.addEventListener("click", function() {
//         closePopup(closeElement.closest(".popup"));
//     })
// }

function constructPopup(task) {
    const editPopup = document.getElementById("edit-task-popup");
    editPopup.querySelector(".popup__task-title").value = task.querySelector(".task__title").textContent;
    editPopup.querySelector(".popup__task-description").value = task.querySelector(".task__description").textContent;
    editPopup.querySelector(`#${task.querySelector(".task__date").textContent}`).classList.add("active");
}


function openPopup(currentPopup) {

    const closeElements = currentPopup.querySelectorAll(".close-popup");
    for (let closeElement of closeElements) {
        // if (closeElement.id === "add-task-popup-btn") {
        //     closeElement.addEventListener("click", function Open() {
        //         closePopup(currentPopup);
        //         closeElement.removeEventListener("click", Open);
        //         console.log("yes-add");

        //     });
        // } else {
        //     closeElement.addEventListener("click", function Open2() {
        //         closePopup(currentPopup);
        //         closeElement.removeEventListener("click", Open2);
        //         console.log("just-yes");
        //     });
        // }
    
        if (closeElement.id === "add-task-popup-btn") closeElement.addEventListener("click", addTaskHandler);
        if (closeElement.id === "edit-task-popup-btn") closeElement.addEventListener("click", editTaskHandler);
        else closeElement.addEventListener("click", closePopupHandler);
    }
    if (currentPopup.querySelector(".popup__date-picker")) currentPopup.querySelector(".popup__date-picker").addEventListener("click", pickDateHandler);
    
    currentPopup.classList.add("open");

    currentPopup.addEventListener("mousedown", outsidePopupClickHandler)

    
}

function pickDateHandler(e) {
    if (e.target.closest(".popup__date-picker").querySelector(".active")) e.target.closest(".popup__date-picker").querySelector(".active").classList.remove("active");
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
    const addTaskPopup = event.target.closest("#add-task-popup");
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
        const editTaskPopup = event.target.closest("#edit-task-popup");
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
    for (let closeElement of closeElements) {
        closeElement.removeEventListener("click", closePopupHandler);
        if (closeElement.id === "add-task-popup-btn") closeElement.removeEventListener("click", addTaskHandler);
        if (closeElement.id === "edit-task-popup-btn") closeElement.removeEventListener("click", editTaskHandler);
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
