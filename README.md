# 📋 Comandas App

Aplicativo para gerenciamento de comandas de restaurante, permitindo **criação de comandas**, **adição de itens**, **consulta de produtos**, **cálculo automático do total** e **controle de status** (aberta, fechada).

---

## 🚀 Funcionalidades

- 📌 **Criar comanda** com número e data automáticos  
- 🛒 **Adicionar e remover itens** por código ou busca  
- 💰 **Cálculo automático do total da comanda**  
- 📦 **Consulta de lista de produtos**  
- 🔒 **Fechar comanda** e salvar no banco de dados  
- 📱 **Interface responsiva** (desktop e mobile)  

---

## 🛠️ Tecnologias Utilizadas

**Frontend**  
- [Next.js](https://nextjs.org/) (React + App Router)  
- [TypeScript](https://www.typescriptlang.org/)  
- [TailwindCSS](https://tailwindcss.com/)  
- [Shadcn/UI](https://ui.shadcn.com/) para componentes

**Backend**  
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- [Prisma ORM](https://www.prisma.io/)  
- Banco de Dados: [PostgreSQL](https://www.postgresql.org/)

---

## 📂 Estrutura do Projeto

```
/comandas-app
├── /frontend   # Código do Next.js
├── /backend    # API com Node.js + Prisma
├── prisma      # Schema e migrations
└── README.md
```

---

## ⚙️ Instalação e Uso

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/comandas-app.git
cd comandas-app
```

### 2️⃣ Configurar o Backend

```bash
cd backend
cp .env.example .env
# Editar variáveis de ambiente no .env
npm install
npx prisma migrate dev
npm run dev
```

### 3️⃣ Configurar o Frontend

```bash
cd frontend
cp .env.example .env
# Editar variáveis (ex: URL da API)
npm install
npm run dev
```

- O frontend estará disponível em: http://localhost:3000  
- O backend estará disponível em: http://localhost:3003

---

## 📌 Variáveis de Ambiente

**Backend** (`backend/.env`)
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/comandas"
PORT=3003
```

**Frontend** (`frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

---

## 🖼️ Screenshots

> _Adicione aqui imagens do app, como:_
> - Criando uma Comanda
> - Lista de Comandas

---

## 🤝 Contribuindo

Contribuições são bem-vindas!  
Para contribuir:

1. Faça um fork
2. Crie uma branch (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: minha nova feature'`)
4. Envie para o repositório remoto (`git push origin minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.