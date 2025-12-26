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

    async getHistory() {
        const { data } = await client
            .from('history')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        return data || [];
    },

    async createUser(name) {
        return await client.from('users').insert([{ name, score: 0 }]);
    },

    async createTask(title, points) {
        return await client.from('tasks').insert([{ title, points: parseInt(points), is_recurring: true }]);
    },

    async completeTask(user, task) {
        await client.from('users').update({ score: (user.score + task.points) }).eq('id', user.id);
        
        await client.from('history').insert([{
            user_id: user.id,
            user_name: user.name,
            task_title: task.title,
            points: task.points
        }]);

        if (!task.is_recurring) {
            await client.from('tasks').delete().eq('id', task.id);
        }
    },

    async undoTask(historyItem) {
        const { data: u } = await client.from('users').select('score').eq('id', historyItem.user_id).single();
        
        if (u) {
            await client.from('users')
                .update({ score: (u.score - historyItem.points) })
                .eq('id', historyItem.user_id);
        }

        await client.from('history').delete().eq('id', historyItem.id);
    },

    async deleteUser(id) {
        const { error } = await client.from('users').delete().eq('id', id);
        if (error) alert("Error: " + error.message);
    },

    async deleteTask(id) {
        const { error } = await client.from('tasks').delete().eq('id', id);
        if (error) alert("Error: " + error.message);
    },

    async updateUser(id, newName) {
        const { error } = await client.from('users').update({ name: newName }).eq('id', id);
        if (error) alert("Error: " + error.message);
    },

    async updateTask(id, newTitle, newPoints) {
        const { error } = await client.from('tasks').update({ 
            title: newTitle, 
            points: parseInt(newPoints) 
        }).eq('id', id);
        if (error) alert("Error: " + error.message);
    },
    
    async resetUserScore(id) {
        await client.from('users').update({ score: 0 }).eq('id', id);
    }
};

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}
