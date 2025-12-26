// REEMPLAZA ESTAS CONSTANTES CON TUS DATOS DE SUPABASE
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_PUBLIC_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ApiService = {
    async getData() {
        const { data: users } = await supabase.from('users').select('*').order('score', {ascending:false});
        const { data: tasks } = await supabase.from('tasks').select('*').order('points', {ascending:true});
        return { users: users || [], tasks: tasks || [] };
    },
    async createUser(name) {
        return await supabase.from('users').insert([{ name, score: 0 }]);
    },
    async createTask(title, points) {
        return await supabase.from('tasks').insert([{ title, points: parseInt(points), is_recurring: true }]);
    },
    async completeTask(userId, task) {
        // 1. Obtener score actual
        const { data: u } = await supabase.from('users').select('score').eq('id', userId).single();
        // 2. Actualizar score
        await supabase.from('users').update({ score: (u.score + task.points) }).eq('id', userId);
        // 3. Eliminar si no es recurrente
        if (!task.is_recurring) await supabase.from('tasks').delete().eq('id', task.id);
    }
};

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}
