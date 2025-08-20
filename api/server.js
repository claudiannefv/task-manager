const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'API para gerenciamento de tarefas com autenticação de usuários',
            contact: {
                name: 'Task Manager',
                email: 'support@taskmanager.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID único do usuário' },
                        name: { type: 'string', description: 'Nome do usuário' },
                        email: { type: 'string', format: 'email', description: 'Email do usuário' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' }
                    }
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID único da tarefa' },
                        userId: { type: 'string', description: 'ID do usuário proprietário' },
                        title: { type: 'string', description: 'Título da tarefa' },
                        description: { type: 'string', description: 'Descrição da tarefa' },
                        dueDate: { type: 'string', format: 'date-time', description: 'Data de vencimento' },
                        completed: { type: 'boolean', description: 'Status de conclusão' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', description: 'Mensagem de erro' }
                    }
                }
            }
        }
    },
    apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Armazenamento em memória
let users = [];
let tasks = [];

// Função para gerar ID único
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Função para encontrar usuário por email
const findUserByEmail = (email) => users.find(user => user.email === email);

// Função para encontrar tarefas de um usuário
const findTasksByUserId = (userId) => tasks.filter(task => task.userId === userId);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuário cadastrado com sucesso"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validações
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nome, email e senha são obrigatórios' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'A senha deve ter pelo menos 6 caracteres' 
            });
        }

        // Verificar se usuário já existe
        if (findUserByEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Usuário já cadastrado com este email' 
            });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const newUser = {
            id: generateId(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com sucesso',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Fazer login de usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validações
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email e senha são obrigatórios' 
            });
        }

        // Buscar usuário
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou senha inválidos' 
            });
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou senha inválidos' 
            });
        }

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Criar nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário proprietário da tarefa
 *                 example: "abc123def456"
 *               title:
 *                 type: string
 *                 description: Título da tarefa
 *                 example: "Estudar JavaScript"
 *               description:
 *                 type: string
 *                 description: Descrição detalhada da tarefa
 *                 example: "Revisar conceitos de ES6+ e async/await"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de vencimento (opcional)
 *                 example: "2024-01-15T10:00:00"
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tarefa criada com sucesso"
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/tasks', (req, res) => {
    try {
        const { userId, title, description, dueDate } = req.body;

        // Validações
        if (!userId || !title) {
            return res.status(400).json({ 
                success: false, 
                message: 'ID do usuário e título são obrigatórios' 
            });
        }

        // Verificar se usuário existe
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuário não encontrado' 
            });
        }

        // Criar tarefa
        const newTask = {
            id: generateId(),
            userId,
            title,
            description: description || '',
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date()
        };

        tasks.push(newTask);

        res.status(201).json({
            success: true,
            message: 'Tarefa criada com sucesso',
            task: newTask
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/tasks/{userId}:
 *   get:
 *     summary: Listar tarefas do usuário
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *         example: "abc123def456"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed]
 *         description: Filtrar por status da tarefa
 *         example: "pending"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pesquisar tarefas por título
 *         example: "javascript"
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/tasks/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { status, search } = req.query;

        // Verificar se usuário existe
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuário não encontrado' 
            });
        }

        let userTasks = findTasksByUserId(userId);

        // Filtro por status
        if (status) {
            if (status === 'completed') {
                userTasks = userTasks.filter(task => task.completed);
            } else if (status === 'pending') {
                userTasks = userTasks.filter(task => !task.completed);
            }
        }

        // Pesquisa por título
        if (search) {
            userTasks = userTasks.filter(task => 
                task.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Ordenar por data de criação (mais recentes primeiro)
        userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            tasks: userTasks
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Atualizar tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *         example: "task123def456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título da tarefa
 *                 example: "Estudar JavaScript Avançado"
 *               description:
 *                 type: string
 *                 description: Nova descrição da tarefa
 *                 example: "Revisar conceitos de ES6+ e async/await"
 *               completed:
 *                 type: boolean
 *                 description: Status de conclusão da tarefa
 *                 example: true
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data de vencimento
 *                 example: "2024-01-15T10:00:00"
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tarefa atualizada com sucesso"
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/api/tasks/:taskId', (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, completed, dueDate } = req.body;

        // Encontrar tarefa
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tarefa não encontrada' 
            });
        }

        // Atualizar tarefa
        if (title !== undefined) tasks[taskIndex].title = title;
        if (description !== undefined) tasks[taskIndex].description = description;
        if (completed !== undefined) tasks[taskIndex].completed = completed;
        if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;

        res.json({
            success: true,
            message: 'Tarefa atualizada com sucesso',
            task: tasks[taskIndex]
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Alterar status da tarefa (concluída/não concluída)
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *         example: "task123def456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completed
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: Status de conclusão da tarefa
 *                 example: true
 *     responses:
 *       200:
 *         description: Status da tarefa alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Status da tarefa alterado com sucesso"
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/tasks/:taskId', (req, res) => {
    try {
        const { taskId } = req.params;
        const { completed } = req.body;

        // Validação
        if (completed === undefined || typeof completed !== 'boolean') {
            return res.status(400).json({ 
                success: false, 
                message: 'O campo "completed" é obrigatório e deve ser um boolean' 
            });
        }

        // Encontrar tarefa
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tarefa não encontrada' 
            });
        }

        // Alterar apenas o status da tarefa
        tasks[taskIndex].completed = completed;

        res.json({
            success: true,
            message: 'Status da tarefa alterado com sucesso',
            task: tasks[taskIndex]
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Excluir tarefa individual
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa a ser excluída
 *         example: "task123def456"
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tarefa excluída com sucesso"
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/tasks/:taskId', (req, res) => {
    try {
        const { taskId } = req.params;

        // Encontrar e remover tarefa
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tarefa não encontrada' 
            });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];

        res.json({
            success: true,
            message: 'Tarefa excluída com sucesso',
            task: deletedTask
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

/**
 * @swagger
 * /api/tasks/user/{userId}:
 *   delete:
 *     summary: Excluir todas as tarefas do usuário
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário cujas tarefas serão excluídas
 *         example: "abc123def456"
 *     responses:
 *       200:
 *         description: Todas as tarefas do usuário foram excluídas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "5 tarefas excluídas com sucesso"
 *                 deletedCount:
 *                   type: integer
 *                   description: Número de tarefas excluídas
 *                   example: 5
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/tasks/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar se usuário existe
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuário não encontrado' 
            });
        }

        // Remover todas as tarefas do usuário
        const deletedTasks = tasks.filter(task => task.userId === userId);
        tasks = tasks.filter(task => task.userId !== userId);

        res.json({
            success: true,
            message: `${deletedTasks.length} tarefas excluídas com sucesso`,
            deletedCount: deletedTasks.length
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api-docs`);
});




