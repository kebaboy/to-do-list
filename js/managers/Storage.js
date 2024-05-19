export class Storage {
    static getTasks() {
        const tasks = localStorage.getItem('tasks') === null ? [] : JSON.parse(localStorage.getItem('tasks'));
        return tasks;
    }
    static saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    static addTask(task) {
        const tasks = Storage.getTasks();
        tasks.push(task);
        Storage.saveTasks(tasks);
    }
    static removeTask(taskId) {
        let tasks = Storage.getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        Storage.saveTasks(tasks);
    }
    static getCompletedTasks() {
        const completedTasks = localStorage.getItem('completedTasks') === null ? [] : JSON.parse(localStorage.getItem('completedTasks'));
        return completedTasks;
    }
    static saveCompletedTasks(completedTasks) {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
    static addCompletedTask(completedTask) {
        const completedTasks = Storage.getCompletedTasks();
        completedTasks.push(completedTask);
        Storage.saveCompletedTasks(completedTasks);
    }
    static generateTaskId() {
        const timestamp = Date.now().toString(36);
        const randomNumber = Math.random().toString(36).slice(2, 7);
        return timestamp + '-' + randomNumber;
    }
}


// class Storage {

//     static getBooks() {
//         const books = localStorage.getItem('books') === null ? [] : JSON.parse(localStorage.getItem('books'));
//         return books;
//     }

//     static addBook(book) {
//         const books = Storage.getBooks();
//         books.push(book);
//         localStorage.setItem('books', JSON.stringify(books));
//     }

//     static removeBook(ind) {
//         const books = Storage.getBooks();
//         books.splice(ind, 1);
//         localStorage.setItem('books', JSON.stringify(books));
//     }
// }