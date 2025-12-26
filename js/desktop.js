const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(`tab-content-${t.dataset.target}`).classList.add('active');
}));

async function load() {
    const data = await ApiService.getData();
    const cont = document.getElementById('leaderboard-container');
    cont.innerHTML = '';
    data.users.forEach((u, i) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        row.innerHTML = `<span>${i===0?'👑 ':''}${u.name}</span><span>${u.score} pts</span>`;
        cont.appendChild(row);
    });
}

document.getElementById('btnRefresh').onclick = () => { load(); showToast('Actualizado'); };

document.getElementById('btnCreateTask').onclick = async () => {
    const t = document.getElementById('newTaskTitle');
    const p = document.getElementById('newTaskPoints');
    if(t.value && p.value) {
        await ApiService.createTask(t.value, p.value);
        t.value=''; p.value=''; showToast('Tarea Creada');
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
