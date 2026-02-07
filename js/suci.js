// SUCHI Todo App JavaScript
// Handles multiple sections: Tasks, Important, My Day

const sections = ['tasks', 'important', 'myday'];

function loadTasks() {
    sections.forEach(section => {
        const tasks = JSON.parse(localStorage.getItem(`tasks-${section}`)) || [];
        const list_el = document.querySelector(`#tasks-${section}`);
        list_el.innerHTML = '';
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed, section, list_el);
        });
    });
}

function saveTasks(section) {
    const list_el = document.querySelector(`#tasks-${section}`);
    const tasks = [];
    list_el.querySelectorAll('.task').forEach(task_el => {
        const input_el = task_el.querySelector('.text');
        tasks.push({
            text: input_el.value,
            completed: task_el.classList.contains('completed')
        });
    });
    localStorage.setItem(`tasks-${section}`, JSON.stringify(tasks));
}

function createTaskElement(taskText, completed = false, section, list_el, dueDate = null) {
    const task_el = document.createElement('div');
    task_el.classList.add('task');
    if (completed) task_el.classList.add('completed');

    const task_content_el = document.createElement('div');
    task_content_el.classList.add('content');

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement('input');
    task_input_el.classList.add('text');
    task_input_el.type = 'text';
    task_input_el.value = taskText;
    task_input_el.setAttribute('readonly', 'readonly');

    task_content_el.appendChild(task_input_el);

    if (dueDate) {
        const due_date_el = document.createElement('div');
        due_date_el.classList.add('due-date');
        due_date_el.innerText = `Due: ${new Date(dueDate).toLocaleDateString()}`;
        task_content_el.appendChild(due_date_el);
    }

    const task_actions_el = document.createElement('div');
    task_actions_el.classList.add('actions');

    const task_edit_el = document.createElement('button');
    task_edit_el.classList.add('edit');
    task_edit_el.innerText = 'Edit';

    const task_delete_el = document.createElement('button');
    task_delete_el.classList.add('delete');
    task_delete_el.innerText = 'Delete';

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    list_el.appendChild(task_el);

    // Event listeners
    task_el.addEventListener('click', (e) => {
        if (e.target !== task_edit_el && e.target !== task_delete_el && e.target !== task_input_el) {
            task_el.classList.toggle('completed');
            saveTasks(section);
        }
    });

    task_edit_el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (task_edit_el.innerText.toLowerCase() == "edit") {
            task_edit_el.innerText = "Save";
            task_input_el.removeAttribute("readonly");
            task_input_el.focus();
        } else {
            task_edit_el.innerText = "Edit";
            task_input_el.setAttribute("readonly", "readonly");
            saveTasks(section);
        }
    });

    task_delete_el.addEventListener('click', (e) => {
        e.stopPropagation();
        list_el.removeChild(task_el);
        saveTasks(section);
    });
}

window.addEventListener('load', () => {
    loadTasks();

    sections.forEach(section => {
        const form = document.querySelector(`#new-task-form-${section}`);
        const input = document.querySelector(`#new-task-input-${section}`);
        const list_el = document.querySelector(`#tasks-${section}`);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const task = input.value.trim();
            if (task === '') {
                alert("Please enter a task");
                return;
            }

            createTaskElement(task, false, section, list_el);
            saveTasks(section);
            input.value = '';
        });
    });
});
