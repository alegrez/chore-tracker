let selectedUserId = null;
const views = { user: document.getElementById('step-user'), task: document.getElementById('step-task') };

async function init() {
    const data = await ApiService.getData();
    const ug = document.getElementById('user-grid');
    ug.innerHTML = '';
    data.users.forEach(u => {
        const btn = document.createElement('button');
        btn.className = 'user-btn'; btn.textContent = u.name;
        btn.onclick = () => { selectUser(u); }; 
        ug.appendChild(btn);
    });

    const tl = document.getElementById('task-list');
    tl.innerHTML = '';
    data.tasks.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        btn.innerHTML = `<span>${t.title}</span><span class="task-pts">+${t.points}</span>`;
        btn.onclick = () => finishTask(t);
        tl.appendChild(btn);
    });

    loadRecentActivity();
}

let currentUserObj = null;

function selectUser(user) {
    currentUserObj = user;
    document.getElementById('greeting').textContent = `Hola, ${user.name}`;
    views.user.style.display = 'none';
    views.task.style.display = 'block';
}

async function finishTask(task) {
    if(!currentUserObj) return;
    try {
        await ApiService.completeTask(currentUserObj, task);
        showToast(`¡Hecho! +${task.points} pts`);
        
        views.user.style.display = 'block';
        views.task.style.display = 'none';
        currentUserObj = null;
        init();
    } catch(e) {
        alert("Error de conexión: " + e.message);
    }
}

async function loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    container.innerHTML = 'Cargando...';
    
    const history = await ApiService.getHistory(); 
    const recent = history.slice(0, 3);
    
    container.innerHTML = '';
    if(recent.length === 0) {
        container.innerHTML = 'Sin actividad hoy.';
        return;
    }

    recent.forEach(item => {
        const div = document.createElement('div');
        const time = new Date(item.created_at).toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'});
        div.innerHTML = `<span>${time}</span> <strong>${item.user_name}</strong>: ${item.task_title}`;
        container.appendChild(div);
    });
}

function switchView(viewName, userName) {
    views.user.style.display = viewName === 'user' ? 'block' : 'none';
    views.task.style.display = viewName === 'task' ? 'block' : 'none';
    if(userName) document.getElementById('greeting').textContent = `Hola, ${userName}`;
}

document.getElementById('btnCancel').onclick = () => switchView('user');
init();
