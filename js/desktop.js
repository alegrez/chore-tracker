const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(`tab-content-${t.dataset.target}`).classList.add('active');
    
    if(t.dataset.target === 'admin') load(); 
}));

async function load() {
    const data = await ApiService.getData();
    const cont = document.getElementById('leaderboard-container');
    cont.innerHTML = '';
    if (data.users.length === 0) cont.innerHTML = '<p>No hay usuarios.</p>';
    
    data.users.forEach((u, i) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        row.innerHTML = `<span>${i===0?'👑 ':''}${u.name}</span><span>${u.score} pts</span>`;
        cont.appendChild(row);
    });

    renderAdminUsers(data.users);
    renderAdminTasks(data.tasks);
}

function renderAdminUsers(users) {
    const tbody = document.querySelector('#admin-users-table tbody');
    tbody.innerHTML = '';
    users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.name}</td>
            <td>${u.score}</td>
            <td class="actions-cell">
                <button class="btn-icon btn-edit" onclick="editUser('${u.id}', '${u.name}')">✏️</button>
                <button class="btn-icon btn-reset" onclick="resetUser('${u.id}')" title="Resetear a 0">0️⃣</button>
                <button class="btn-icon btn-delete" onclick="deleteUser('${u.id}')">🗑</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdminTasks(tasks) {
    const tbody = document.querySelector('#admin-tasks-table tbody');
    tbody.innerHTML = '';
    tasks.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.title}</td>
            <td>${t.points}</td>
            <td class="actions-cell">
                <button class="btn-icon btn-edit" onclick="editTask('${t.id}', '${t.title}', ${t.points})">✏️</button>
                <button class="btn-icon btn-delete" onclick="deleteTask('${t.id}')">🗑</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.editUser = async (id, currentName) => {
    const newName = prompt("Nuevo nombre:", currentName);
    if (newName && newName !== currentName) {
        await ApiService.updateUser(id, newName);
        showToast("Usuario actualizado"); load();
    }
};

window.resetUser = async (id) => {
    if(confirm("¿Reiniciar puntaje a 0?")) {
        await ApiService.resetUserScore(id);
        showToast("Puntaje reiniciado"); load();
    }
};

window.deleteUser = async (id) => {
    if(confirm("¿Eliminar usuario?")) {
        await ApiService.deleteUser(id);
        showToast("Usuario eliminado"); load();
    }
};

window.editTask = async (id, currentTitle, currentPoints) => {
    const newTitle = prompt("Título de tarea:", currentTitle);
    if (newTitle) {
        const newPoints = prompt("Puntos:", currentPoints);
        if (newPoints) {
            await ApiService.updateTask(id, newTitle, newPoints);
            showToast("Tarea actualizada"); load();
        }
    }
};

window.deleteTask = async (id) => {
    if(confirm("¿Eliminar tarea?")) {
        await ApiService.deleteTask(id);
        showToast("Tarea eliminada"); load();
    }
};

document.getElementById('btnRefresh').onclick = () => { load(); showToast('Actualizado'); };

document.getElementById('btnCreateTask').onclick = async () => {
    const t = document.getElementById('newTaskTitle');
    const p = document.getElementById('newTaskPoints');
    if(t.value && p.value) {
        await ApiService.createTask(t.value, p.value);
        t.value=''; p.value=''; showToast('Tarea Creada'); load();
    }
};
document.getElementById('btnCreateUser').onclick = async () => {
    const n = document.getElementById('newUserName');
    if(n.value) {
        await ApiService.createUser(n.value);
        n.value=''; showToast('Usuario Creado'); load();
    }
};
load();
