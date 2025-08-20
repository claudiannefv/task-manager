# Task Manager - Gerenciador de Tarefas

Uma aplicação web completa para gerenciamento de tarefas com sistema de autenticação de usuários, desenvolvida com Node.js, Express, HTML, CSS e JavaScript.

## 🚀 Funcionalidades

### Requisitos Funcionais Implementados

- ✅ **RF01** - Cadastro de Usuário: Sistema de registro com nome, email e senha
- ✅ **RF02** - Login de Usuário: Validação de credenciais para acesso
- ✅ **RF03** - Criação de Tarefas: Interface para criar novas tarefas
- ✅ **RF04** - Detalhes da Tarefa: Título, descrição e data de vencimento opcional
- ✅ **RF05** - Alteração de Status: Marcar tarefas como concluídas/pendentes
- ✅ **RF06** - Edição de Tarefa: Modificar título e descrição
- ✅ **RF07** - Exclusão Individual: Remover tarefas específicas
- ✅ **RF08** - Exclusão em Massa: Excluir todas as tarefas do usuário
- ✅ **RF09** - Filtro por Status: Filtrar por todas, pendentes ou concluídas
- ✅ **RF10** - Pesquisa por Título: Buscar tarefas pelo título
- ✅ **RF11** - Mensagens de Feedback: Sistema de notificações

### Requisitos Não Funcionais Implementados

- ✅ **RNF01** - Frontend: HTML, CSS e JavaScript
- ✅ **RNF02** - Backend: Node.js e Express
- ✅ **RNF03** - Armazenamento: Arrays em memória
- ✅ **RNF04** - Responsividade: Interface adaptável para mobile e desktop
- ✅ **RNF05** - Organização: Código separado em arquivos
- ✅ **RNF06** - Rotas REST: API seguindo padrões REST
- ✅ **RNF07** - Múltiplos Usuários: Suporte a vários usuários simultâneos
- ✅ **RNF08** - Sem Banco: Armazenamento apenas em memória
- ✅ **RNF09** - Desempenho: Resposta rápida da API
- ✅ **RNF10** - Manutenibilidade: Código bem estruturado

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **bcryptjs** - Criptografia de senhas
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização responsiva
- **JavaScript ES6+** - Lógica da aplicação
- **Font Awesome** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd task-manager
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   npm start
   ```

4. **Acesse a aplicação**
   - Abra seu navegador
   - Acesse: `http://localhost:3000`

### Modo de Desenvolvimento
Para desenvolvimento com reinicialização automática:
```bash
npm run dev
```

## 🎯 Como Usar

### 1. Cadastro de Usuário
- Acesse a aplicação
- Clique na aba "Cadastro"
- Preencha nome, email e senha (mínimo 6 caracteres)
- Clique em "Cadastrar"

### 2. Login
- Use as credenciais cadastradas
- Clique em "Entrar"
- Você será redirecionado para o painel de tarefas

### 3. Gerenciamento de Tarefas

#### Criar Nova Tarefa
- Clique em "Nova Tarefa"
- Preencha título (obrigatório)
- Adicione descrição (opcional)
- Defina data de vencimento (opcional)
- Clique em "Salvar"

#### Editar Tarefa
- Clique no botão "Editar" na tarefa desejada
- Modifique os campos necessários
- Clique em "Salvar"

#### Marcar como Concluída
- Use o checkbox ao lado do título da tarefa
- A tarefa será marcada automaticamente

#### Excluir Tarefa
- Clique no botão "Excluir" na tarefa desejada
- Confirme a ação no modal

#### Excluir Todas as Tarefas
- Clique em "Excluir Todas"
- Confirme a ação no modal

### 4. Filtros e Pesquisa

#### Filtrar por Status
- Use o dropdown "Todas as tarefas"
- Selecione: "Todas", "Pendentes" ou "Concluídas"

#### Pesquisar por Título
- Digite no campo "Pesquisar por título..."
- A pesquisa é feita automaticamente

## 🏗️ Estrutura do Projeto

Este repositório agora está separado em dois projetos independentes:

```
task-manager/
├── api/                  # Projeto da API (Node.js/Express)
│   ├── server.js
│   ├── package.json
│   └── README.md
├── web/                  # Projeto do Frontend estático
│   ├── public/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   ├── package.json
│   └── README.md
└── package.json          # Scripts utilitários da raiz
```

### Como rodar

1) API

```
cd api
npm install
npm run dev
```

2) Web

```
cd web
npm install
npm start
```

Por padrão, o frontend consumirá a API em `http://localhost:4000/api`. Você pode sobrescrever definindo `window.API_BASE_URL` em `web/public/index.html`.

## 🔧 API Endpoints

### Autenticação
- `POST /api/register` - Cadastrar usuário
- `POST /api/login` - Fazer login

### Tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/:userId` - Listar tarefas do usuário
- `PUT /api/tasks/:taskId` - Atualizar tarefa
- `PATCH /api/tasks/:taskId` - Alterar status
- `DELETE /api/tasks/:taskId` - Excluir tarefa individual
- `DELETE /api/tasks/user/:userId` - Excluir todas as tarefas do usuário

### Parâmetros de Query
- `status` - Filtrar por status (pending, completed)
- `search` - Pesquisar por título

## 🎨 Características da Interface

### Design Responsivo
- Interface adaptável para desktop, tablet e mobile
- Layout flexível com CSS Grid e Flexbox
- Animações suaves e transições

### Sistema de Notificações
- Feedback visual para todas as ações
- Notificações de sucesso, erro e informação
- Auto-remoção após 5 segundos

### Modais Interativos
- Modal para criação/edição de tarefas
- Modal de confirmação para ações destrutivas
- Fechamento por clique fora ou botão

### Estados Visuais
- Tarefas concluídas com estilo diferenciado
- Indicador visual para tarefas vencidas
- Estado vazio quando não há tarefas

## 🔒 Segurança

### Autenticação
- Senhas criptografadas com bcrypt
- Validação de credenciais no servidor
- Armazenamento seguro de sessão no localStorage

### Validação
- Validação de entrada no frontend e backend
- Sanitização de dados para prevenir XSS
- Verificação de permissões de usuário

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome (versão 60+)
- Firefox (versão 55+)
- Safari (versão 12+)
- Edge (versão 79+)

### Dispositivos
- Desktop (Windows, macOS, Linux)
- Tablet (iOS, Android)
- Mobile (iOS, Android)

## 🚨 Limitações

### Armazenamento
- Dados são perdidos ao reiniciar o servidor
- Não há persistência em banco de dados
- Limitação de memória para muitos usuários

### Segurança
- Autenticação simplificada sem JWT
- Sem controle de sessão avançado
- Criptografia básica de senhas

## 🔮 Melhorias Futuras

- [ ] Integração com banco de dados
- [ ] Sistema de autenticação JWT
- [ ] Categorização de tarefas
- [ ] Sistema de prioridades
- [ ] Notificações push
- [ ] Compartilhamento de tarefas
- [ ] Backup e exportação de dados
- [ ] Temas personalizáveis
- [ ] Modo offline
- [ ] Integração com calendário

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como projeto de estudo para implementação de requisitos funcionais e não funcionais em aplicação web.

---

**Nota**: Esta aplicação é destinada para fins educacionais e demonstração. Para uso em produção, considere implementar melhorias de segurança e persistência de dados.
