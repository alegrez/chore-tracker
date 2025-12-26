let selectedUserId = null;
const views = { user: document.getElementById('step-user'), task: document.getElementById('step-task') };

async function init() {
    const data = await ApiService.getData();
    const ug = document.getElementById('user-grid');
    ug.innerHTML = '';
    data.users.forEach(u => {
        const btn = document.createElement('button');
        btn.className = 'user-btn'; btn.textContent = u.name;
        btn.onclick = () => { selectedUserId = u.id; switchView('task', u.name); };
        ug.appendChild(btn);
    });

    const tl = document.getElementById('task-list');
    tl.innerHTML = '';
    data.tasks.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.innerHTML = `<span>${t.title}</span><span class="task-pts">+${t.points}</span>`;
        btn.onclick = async () => {
            await ApiService.completeTask(selectedUserId, t);
            showToast(`+${t.points} Puntos!`);
            init(); switchView('user');
        };
        tl.appendChild(btn);
    });
}

function switchView(viewName, userName) {
    views.user.style.display = viewName === 'user' ? 'block' : 'none';
    views.task.style.display = viewName === 'task' ? 'block' : 'none';
    if(userName) document.getElementById('greeting').textContent = `Hola, ${userName}`;
}

document.getElementById('btnCancel').onclick = () => switchView('user');
init();
