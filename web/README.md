# Task Manager Web

Frontend estático (HTML/CSS/JS) separado da API.

## Como rodar

1. Instale dependências
```bash
npm install
```
2. Inicie um servidor estático
```bash
npm start
```
3. Acesse
- Web: `http://localhost:3000`
- Configure a API via `window.API_BASE_URL` ou use padrão `http://localhost:4000/api`.

## Configuração da URL da API
No arquivo `public/index.html`, você pode definir:
```html
<script>
  window.API_BASE_URL = 'http://localhost:4000/api';
</script>
```

Os arquivos do site estão em `public/`.


