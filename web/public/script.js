// Estado global da aplicação
let currentUser = null;
let currentTasks = [];
let editingTaskId = null;

// URL base da API (pode ser sobrescrita via window.API_BASE_URL)
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL) || 'http://localhost:4000/api';

// Elementos DOM
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskModal = document.getElementById('taskModal');
const confirmModal = document.getElementById('confirmModal');

// Verificar se usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
	checkAuthStatus();
	setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
	// Tabs de autenticação
	document.querySelectorAll('.tab-btn').forEach(btn => {
		btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
	});

	// Formulários de autenticação
	document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
	document.getElementById('registerFormElement').addEventListener('submit', handleRegister);

	// Logout
	logoutBtn.addEventListener('click', handleLogout);

	// Controles de tarefas
	document.getElementById('addTaskBtn').addEventListener('click', () => openTaskModal());
	document.getElementById('deleteAllBtn').addEventListener('click', () => confirmDeleteAll());
	document.getElementById('statusFilter').addEventListener('change', loadTasks);
	document.getElementById('searchInput').addEventListener('input', debounce(loadTasks, 300));

	// Modal de tarefa
	document.getElementById('closeModal').addEventListener('click', closeTaskModal);
	document.getElementById('cancelTask').addEventListener('click', closeTaskModal);
	document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);

	// Modal de confirmação
	document.getElementById('closeConfirmModal').addEventListener('click', closeConfirmModal);
	document.getElementById('cancelConfirm').addEventListener('click', closeConfirmModal);
	document.getElementById('confirmAction').addEventListener('click', handleConfirmAction);

	// Fechar modais ao clicar fora
	window.addEventListener('click', (e) => {
		if (e.target === taskModal) closeTaskModal();
		if (e.target === confirmModal) closeConfirmModal();
	});
}

// Verificar status de autenticação
function checkAuthStatus() {
	const savedUser = localStorage.getItem('currentUser');
	if (savedUser) {
		currentUser = JSON.parse(savedUser);
		showAppSection();
		loadTasks();
	} else {
		showAuthSection();
	}
}

// Alternar entre tabs de autenticação
function switchAuthTab(tab) {
	document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
	document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
	
	document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
	document.getElementById(`${tab}Form`).classList.add('active');
}

// Mostrar seção de autenticação
function showAuthSection() {
	authSection.style.display = 'flex';
	appSection.style.display = 'none';
	userInfo.style.display = 'none';
}

// Mostrar seção principal da aplicação
function showAppSection() {
	authSection.style.display = 'none';
	appSection.style.display = 'block';
	userInfo.style.display = 'flex';
	userName.textContent = currentUser.name;
}

// Função de debounce para pesquisa
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// API Functions
async function apiRequest(endpoint, options = {}) {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		const data = await response.json();
		
		if (!response.ok) {
			throw new Error(data.message || 'Erro na requisição');
		}

		return data;
	} catch (error) {
		throw error;
	}
}

// Handlers de autenticação
async function handleLogin(e) {
	e.preventDefault();
	
	const email = document.getElementById('loginEmail').value;
	const password = document.getElementById('loginPassword').value;

	try {
		const data = await apiRequest('/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		currentUser = data.user;
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
		
		showNotification('success', 'Login realizado com sucesso!');
		showAppSection();
		loadTasks();
		
		document.getElementById('loginFormElement').reset();
	} catch (error) {
		showNotification('error', error.message);
	}
}

async function handleRegister(e) {
	e.preventDefault();
	
	const name = document.getElementById('registerName').value;
	const email = document.getElementById('registerEmail').value;
	const password = document.getElementById('registerPassword').value;

	try {
		await apiRequest('/register', {
			method: 'POST',
			body: JSON.stringify({ name, email, password })
		});

		showNotification('success', 'Usuário cadastrado com sucesso! Faça login para continuar.');
		switchAuthTab('login');
		
		document.getElementById('registerFormElement').reset();
	} catch (error) {
		showNotification('error', error.message);
	}
}

function handleLogout() {
	currentUser = null;
	currentTasks = [];
	localStorage.removeItem('currentUser');
	showAuthSection();
	showNotification('info', 'Logout realizado com sucesso!');
}

// Handlers de tarefas
async function loadTasks() {
	if (!currentUser) return;

	try {
		const statusFilter = document.getElementById('statusFilter').value;
		const searchQuery = document.getElementById('searchInput').value;
		
		let endpoint = `/tasks/${currentUser.id}`;
		const params = new URLSearchParams();
		
		if (statusFilter) params.append('status', statusFilter);
		if (searchQuery) params.append('search', searchQuery);
		
		if (params.toString()) {
			endpoint += `?${params.toString()}`;
		}

		const data = await apiRequest(endpoint);
		currentTasks = data.tasks;
		renderTasks();
	} catch (error) {
		showNotification('error', 'Erro ao carregar tarefas: ' + error.message);
	}
}

function renderTasks() {
	if (currentTasks.length === 0) {
		taskList.style.display = 'none';
		emptyState.style.display = 'block';
		return;
	}

	taskList.style.display = 'grid';
	emptyState.style.display = 'none';

	taskList.innerHTML = currentTasks.map(task => `
		<div class="task-item ${task.completed ? 'completed' : ''} fade-in">
			<div class="task-header">
				<div>
					<h3 class="task-title">${escapeHtml(task.title)}</h3>
					${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
				</div>
				<div class="task-checkbox">
					<input type="checkbox" 
						   ${task.completed ? 'checked' : ''} 
						   onchange="toggleTaskStatus('${task.id}', this.checked)">
					<span>${task.completed ? 'Concluída' : 'Pendente'}</span>
				</div>
			</div>
			
			<div class="task-meta">
				<div class="task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}">
					${task.dueDate ? `
						<i class="fas fa-calendar-alt"></i>
						${formatDate(task.dueDate)}
						${isOverdue(task.dueDate) ? ' (Vencida)' : ''}
					` : ''}
				</div>
				<div class="task-actions-buttons">
					<button class="btn btn-secondary" onclick="editTask('${task.id}')">
						<i class="fas fa-edit"></i> Editar
					</button>
					<button class="btn btn-danger" onclick="deleteTask('${task.id}')">
						<i class="fas fa-trash"></i> Excluir
					</button>
				</div>
			</div>
		</div>
	`).join('');
}

// Handlers de ações de tarefas
async function toggleTaskStatus(taskId, completed) {
	try {
		await apiRequest(`/tasks/${taskId}`, {
			method: 'PUT',
			body: JSON.stringify({ completed })
		});

		showNotification('success', `Tarefa ${completed ? 'concluída' : 'marcada como pendente'}!`);
		loadTasks();
	} catch (error) {
		showNotification('error', 'Erro ao atualizar tarefa: ' + error.message);
		loadTasks(); // Recarregar para reverter mudança
	}
}

function editTask(taskId) {
	const task = currentTasks.find(t => t.id === taskId);
	if (!task) return;

	editingTaskId = taskId;
	document.getElementById('modalTitle').textContent = 'Editar Tarefa';
	document.getElementById('taskTitle').value = task.title;
	document.getElementById('taskDescription').value = task.description || '';
	document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.slice(0, 16) : '';
	
	openTaskModal();
}

async function deleteTask(taskId) {
	const task = currentTasks.find(t => t.id === taskId);
	if (!task) return;

	showConfirmModal(
		'Excluir Tarefa',
		`Tem certeza que deseja excluir a tarefa "${task.title}"?`,
		() => performDeleteTask(taskId)
	);
}

async function performDeleteTask(taskId) {
	try {
		await apiRequest(`/tasks/${taskId}`, {
			method: 'DELETE'
		});

		showNotification('success', 'Tarefa excluída com sucesso!');
		loadTasks();
	} catch (error) {
		showNotification('error', 'Erro ao excluir tarefa: ' + error.message);
	}
}

function confirmDeleteAll() {
	showConfirmModal(
		'Excluir Todas as Tarefas',
		`Tem certeza que deseja excluir todas as ${currentTasks.length} tarefas? Esta ação não pode ser desfeita.`,
		performDeleteAllTasks
	);
}

async function performDeleteAllTasks() {
	try {
		await apiRequest(`/tasks/user/${currentUser.id}`, {
			method: 'DELETE'
		});

		showNotification('success', 'Todas as tarefas foram excluídas!');
		loadTasks();
	} catch (error) {
		showNotification('error', 'Erro ao excluir tarefas: ' + error.message);
	}
}

// Handlers de modal
function openTaskModal() {
	taskModal.style.display = 'flex';
	document.body.style.overflow = 'hidden';
}

function closeTaskModal() {
	taskModal.style.display = 'none';
	document.body.style.overflow = 'auto';
	editingTaskId = null;
	document.getElementById('modalTitle').textContent = 'Nova Tarefa';
	document.getElementById('taskForm').reset();
}

async function handleTaskSubmit(e) {
	e.preventDefault();
	
	const title = document.getElementById('taskTitle').value.trim();
	const description = document.getElementById('taskDescription').value.trim();
	const dueDate = document.getElementById('taskDueDate').value;

	if (!title) {
		showNotification('error', 'O título é obrigatório!');
		return;
	}

	try {
		if (editingTaskId) {
			// Editar tarefa existente
			await apiRequest(`/tasks/${editingTaskId}`, {
				method: 'PUT',
				body: JSON.stringify({ title, description, dueDate: dueDate || null })
			});
			showNotification('success', 'Tarefa atualizada com sucesso!');
		} else {
			// Criar nova tarefa
			await apiRequest('/tasks', {
				method: 'POST',
				body: JSON.stringify({
					userId: currentUser.id,
					title,
					description,
					dueDate: dueDate || null
				})
			});
			showNotification('success', 'Tarefa criada com sucesso!');
		}

		closeTaskModal();
		loadTasks();
	} catch (error) {
		showNotification('error', 'Erro ao salvar tarefa: ' + error.message);
	}
}

// Handlers de modal de confirmação
let confirmCallback = null;

function showConfirmModal(title, message, callback) {
	confirmCallback = callback;
	document.getElementById('confirmMessage').textContent = message;
	confirmModal.style.display = 'flex';
	document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
	confirmModal.style.display = 'none';
	document.body.style.overflow = 'auto';
	confirmCallback = null;
}

function handleConfirmAction() {
	if (confirmCallback) {
		confirmCallback();
	}
	closeConfirmModal();
}

// Sistema de notificações
function showNotification(type, message) {
	const container = document.getElementById('notificationContainer');
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	
	const icon = type === 'success' ? 'fa-check-circle' : 
				 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
	
	notification.innerHTML = `
		<i class="fas ${icon}"></i>
		<div class="notification-content">
			<h4>${type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Informação'}</h4>
			<p>${message}</p>
		</div>
	`;

	container.appendChild(notification);

	// Remover notificação após 5 segundos
	setTimeout(() => {
		notification.style.opacity = '0';
		notification.style.transform = 'translateX(100%)';
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}, 5000);
}

// Funções utilitárias
function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function formatDate(dateString) {
	if (!dateString) return '';
	
	const date = new Date(dateString);
	return date.toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

function isOverdue(dateString) {
	if (!dateString) return false;
	
	const dueDate = new Date(dateString);
	const now = new Date();
	return dueDate < now;
}




