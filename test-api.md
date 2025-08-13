# Testes da API - Task Manager

Este documento contém exemplos de como testar a API da aplicação Task Manager.

## 🚀 Como Testar

### 1. Iniciar o Servidor
```bash
npm start
```

### 2. Acessar a Aplicação Web
- Abra o navegador
- Acesse: `http://localhost:3000`

### 3. Testar via API (usando curl, Postman ou similar)

## 📋 Exemplos de Testes da API

### Cadastro de Usuário
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Login de Usuário
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Criar Tarefa
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "ID_DO_USUARIO_AQUI",
    "title": "Estudar JavaScript",
    "description": "Revisar conceitos de ES6+",
    "dueDate": "2024-01-15T10:00:00"
  }'
```

### Listar Tarefas do Usuário
```bash
curl -X GET "http://localhost:3000/api/tasks/ID_DO_USUARIO_AQUI"
```

### Listar Tarefas com Filtro
```bash
# Apenas pendentes
curl -X GET "http://localhost:3000/api/tasks/ID_DO_USUARIO_AQUI?status=pending"

# Apenas concluídas
curl -X GET "http://localhost:3000/api/tasks/ID_DO_USUARIO_AQUI?status=completed"

# Com pesquisa
curl -X GET "http://localhost:3000/api/tasks/ID_DO_USUARIO_AQUI?search=javascript"
```

### Atualizar Tarefa
```bash
curl -X PUT http://localhost:3000/api/tasks/ID_DA_TAREFA_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar JavaScript Avançado",
    "description": "Revisar conceitos de ES6+ e async/await",
    "completed": true
  }'
```

### Alterar Status da Tarefa (PATCH)
```bash
# Marcar como concluída
curl -X PATCH http://localhost:3000/api/tasks/ID_DA_TAREFA_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'

# Marcar como não concluída
curl -X PATCH http://localhost:3000/api/tasks/ID_DA_TAREFA_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "completed": false
  }'
```

### Excluir Tarefa Individual
```bash
curl -X DELETE http://localhost:3000/api/tasks/ID_DA_TAREFA_AQUI
```

### Excluir Todas as Tarefas do Usuário
```bash
curl -X DELETE http://localhost:3000/api/tasks/user/ID_DO_USUARIO_AQUI
```

## 🔧 Testes com Postman

### Collection para Postman
```json
{
  "info": {
    "name": "Task Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao@email.com\",\n  \"password\": \"123456\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "register"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"joao@email.com\",\n  \"password\": \"123456\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "login"]
        }
      }
    }
  ]
}
```

## 📝 Fluxo de Teste Completo

### 1. Cadastrar Usuário
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@email.com",
    "password": "123456"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "user": {
    "id": "abc123...",
    "name": "Maria Santos",
    "email": "maria@email.com"
  }
}
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "password": "123456"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "abc123...",
    "name": "Maria Santos",
    "email": "maria@email.com"
  }
}
```

### 3. Criar Tarefas
```bash
# Tarefa 1
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123...",
    "title": "Estudar Node.js",
    "description": "Aprender Express e middleware",
    "dueDate": "2024-01-20T14:00:00"
  }'

# Tarefa 2
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123...",
    "title": "Fazer exercícios",
    "description": "30 minutos de atividade física",
    "dueDate": "2024-01-15T18:00:00"
  }'
```

### 4. Listar Tarefas
```bash
curl -X GET "http://localhost:3000/api/tasks/abc123..."
```

### 5. Marcar Tarefa como Concluída
```bash
# Usando PATCH (recomendado para alterar apenas status)
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'

# Ou usando PUT (para alterar outros campos também)
curl -X PUT http://localhost:3000/api/tasks/TASK_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### 6. Editar Tarefa
```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Node.js Avançado",
    "description": "Aprender Express, middleware e autenticação"
  }'
```

### 7. Testar Filtros
```bash
# Apenas pendentes
curl -X GET "http://localhost:3000/api/tasks/abc123...?status=pending"

# Apenas concluídas
curl -X GET "http://localhost:3000/api/tasks/abc123...?status=completed"

# Pesquisar por "estudar"
curl -X GET "http://localhost:3000/api/tasks/abc123...?search=estudar"
```

## ⚠️ Observações Importantes

1. **IDs Dinâmicos**: Os IDs de usuário e tarefa são gerados dinamicamente. Use os IDs retornados nas respostas para os próximos testes.

2. **Armazenamento em Memória**: Os dados são perdidos ao reiniciar o servidor.

3. **Validações**: 
   - Senha deve ter pelo menos 6 caracteres
   - Email deve ser único
   - Título da tarefa é obrigatório

4. **Respostas de Erro**: A API retorna códigos de status HTTP apropriados:
   - 200: Sucesso
   - 201: Criado com sucesso
   - 400: Erro de validação
   - 401: Não autorizado
   - 404: Não encontrado
   - 500: Erro interno do servidor

## 🎯 Testes de Cenários de Erro

### Email já cadastrado
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### Senha muito curta
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao2@email.com",
    "password": "123"
  }'
```

### Login com credenciais inválidas
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senhaerrada"
  }'
```

### Criar tarefa sem título
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "abc123...",
    "description": "Tarefa sem título"
  }'
```

