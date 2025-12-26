const SUPABASE_URL = 'https://fcaeedkrddvzkbqhyvjd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EWaIZh2tQxqsmO3nFrOo1g_YMlRp2z9';

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ApiService = {
    async getData() {
        const { data: users } = await client
            .from('users')
            .select('*')
            .order('score', { ascending: false });
            
        const { data: tasks } = await client
            .from('tasks')
            .select('*')
            .order('points', { ascending: true });

        return { users: users || [], tasks: tasks || [] };
    },

    async createUser(name) {
        return await client.from('users').insert([{ name, score: 0 }]);
    },

    async createTask(title, points) {
        return await client.from('tasks').insert([{ title, points: parseInt(points), is_recurring: true }]);
    },

    async completeTask(userId, task) {
        const { data: u } = await client.from('users').select('score').eq('id', userId).single();
        
        await client.from('users').update({ score: (u.score + task.points) }).eq('id', userId);

        if (!task.is_recurring) {
            await client.from('tasks').delete().eq('id', task.id);
        }
    }
};

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}
