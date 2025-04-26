const taskInput = document.getElementById('taskInput');
const executeBtn = document.getElementById('executeBtn');
const taskResult = document.getElementById('taskResult');
const historyList = document.getElementById('historyList');

let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];

// Display history on load
renderHistory();

executeBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    if (!task) return;
    
    taskResult.innerHTML = '<p class="loading">AI is processing your task...</p>';
    
    try {
        const response = await fetch('/api/process-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task })
        });
        const rawResponse = await response.text();
        console.log("Raw response:", rawResponse);
        const data = JSON.parse(rawResponse);


        if (data.success) {
            taskResult.innerHTML = `<p>${data.result.replace(/\n/g, '<br>')}</p>`;
            
            // Add to history
            taskHistory.unshift({
                task,
                result: data.result,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 10 items
            if (taskHistory.length > 10) taskHistory.pop();
            
            localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
            renderHistory();
        } else {
            taskResult.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("Full error:", error);
        taskResult.innerHTML = `<p class="error">Error: ${error.message}<br>Server response: ${rawResponse || 'none'}</p>`;
      }
});

function renderHistory() {
    historyList.innerHTML = taskHistory.map((item, index) => `
        <li onclick="loadHistoryItem(${index})">
            <strong>${item.task.substring(0, 50)}${item.task.length > 50 ? '...' : ''}</strong>
            <small>${new Date(item.timestamp).toLocaleString()}</small>
        </li>
    `).join('');
}

window.loadHistoryItem = (index) => {
    const item = taskHistory[index];
    taskInput.value = item.task;
    taskResult.innerHTML = `<p>${item.result.replace(/\n/g, '<br>')}</p>`;
};