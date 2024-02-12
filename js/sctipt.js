function addTask() {
    let taskContent = document.querySelector(".add-task__input").value;
    let taskList = document.querySelector(".tasks__list");
    let task = document.createElement("div");
    task.textContent = taskContent;
    taskList.append(task);
}