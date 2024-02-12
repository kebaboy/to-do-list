function createTask(inputValue) {
    let task = document.createElement("li");
    task.classList.add("tasks__task", "task");

    let taskTitle = document.createElement("h3");
    taskTitle.classList.add("task__title");
    taskTitle.textContent = inputValue;
    task.append(taskTitle);

    let taskData = document.createElement("div");
    taskData.classList.add("task__date");
    taskData.textContent = "today";
    task.append(taskData);

    let taskDeleteButton = document.createElement("button");
    taskDeleteButton.classList.add("task__delete-btn");
    taskDeleteButton.textContent = "X";
    taskDeleteButton.onclick = function() {
        taskDeleteButton.parentElement.remove();
    }
    task.append(taskDeleteButton)

    return task;
}

function addTask() {
    let taskInput = document.querySelector(".add-task__input");

    if (taskInput.value.trim() !== "") {
        let task = createTask(taskInput.value);
        taskList.append(task);
    } else {
        modal.classList.add("open");
    }


    taskInput.value = "";
}

document.querySelector(".add-task__input").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
})

modal = document.querySelector(".modal");
modal.querySelector(".modal__close").addEventListener("click", () => {
    modal.classList.remove("open");
})
taskList = document.querySelector(".tasks__list");

modal.querySelector(".modal__add").addEventListener("click", () => {
    let taskTitle = document.querySelector(".modal__task-title").value;
    console.log(taskTitle);
    let task = createTask(taskTitle);
    let taskList = document.querySelector(".tasks__list");
    taskList.append(task);
    modal.classList.remove("open");
})


