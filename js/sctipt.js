function createTask() {
    let taskTitleContent = document.querySelector(".add-task__input").value;

    let task = document.createElement("li");
    task.classList.add("tasks__task", "task");

    let taskTitle = document.createElement("h3");
    taskTitle.classList.add("task__title");
    taskTitle.textContent = taskTitleContent;
    task.append(taskTitle);

    let taskEditButton = document.createElement("button");
    taskEditButton.classList.add("task__edit-btn");
    taskEditButton.textContent = "E";
    task.append(taskEditButton)

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
    let taskList = document.querySelector(".tasks__list");

    let task = createTask();

    taskList.append(task);
}