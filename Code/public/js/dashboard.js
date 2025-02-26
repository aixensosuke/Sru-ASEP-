class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskList = document.querySelector('.task-list');
        this.taskInput = document.getElementById('newTaskInput');
        this.taskForm = document.getElementById('taskForm');
        this.init();
    }

    init() {
        this.renderTasks();
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                dueDate: document.getElementById('taskDueDate').value
            };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
            document.getElementById('taskDueDate').value = '';
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        this.taskList.innerHTML = this.tasks
            .map(task => `
                <li class="task-item ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" 
                           id="task-${task.id}" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="taskManager.toggleTask(${task.id})">
                    <label for="task-${task.id}">${task.text}</label>
                    <span class="due-date">${task.dueDate}</span>
                    <button onclick="taskManager.deleteTask(${task.id})" class="delete-task">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `).join('');
    }
}

const taskManager = new TaskManager();
