// 给定唯一的键名
const KEY = "todo"
// 获取所有列表项
export function get() {
    const result = localStorage.getItem(KEY);
    if (result) {
        return JSON.parse(result);
    }
    return [];
}

// 保存一项
export function save(item) {
    localStorage.setItem(KEY, JSON.stringify(item));
}

// 获取唯一ID
export function getUID() {
    return Date.now() + Math.random().toString(16).substr(2, 4);
}

// 筛选任务列表
export function filter(todos, type = 'all') {
    if(type === 'all') {
        return todos;
    }else if(type === 'active') {
        return todos.filter((todo) => !todo.completed);
    }else if(type === 'completed'){
        return todos.filter((todo) => todo.completed)
    }else {
        throw new Error("this is not ");
    }
}