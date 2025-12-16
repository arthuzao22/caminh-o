# RETORNO - Marketplace de Fretes de Retorno

Sistema completo de marketplace que conecta motoristas com veículos retornando vazios a empresas que precisam contratar frete naquela rota.

## 🎯 Funcionalidades

### Para Motoristas
- Cadastro de veículos
- Upload de fotos dos veículos
- Publicação de disponibilidades de retorno
- Gerenciamento de publicações
- Chat integrado com clientes
- Integração com WhatsApp

### Para Clientes/Empresas
- Busca de fretes disponíveis por rota
- Filtros avançados (origem, destino, data, capacidade)
- Visualização de perfis de motoristas
- Chat direto com motoristas
- Contato via WhatsApp

## 🛠️ Tecnologias

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **Validação**: Zod
- **Estilização**: Tailwind CSS
- **Segurança**: bcryptjs para hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd projecttrucks
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL`: URL de conexão com PostgreSQL (com pooling)
- `DIRECT_URL`: URL direta para migrations
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth (gere uma segura)
- `NEXTAUTH_URL`: URL da aplicação

4. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```

5. Gere o Prisma Client:
```bash
npx prisma generate
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
npx prisma studio    # Abre Prisma Studio para gerenciar DB
npx prisma migrate dev # Cria nova migration
```

## 🗄️ Estrutura do Banco de Dados

### Modelos Principais

- **User**: Usuários (DRIVER, CLIENT, ADMIN)
- **Vehicle**: Veículos cadastrados por motoristas
- **VehiclePhoto**: Fotos dos veículos
- **ReturnAvailability**: Publicações de disponibilidade de retorno
- **Chat**: Conversas entre usuários
- **Message**: Mensagens trocadas

## 🔒 Segurança

O sistema implementa:
- ✅ Autenticação com NextAuth.js
- ✅ Hash de senhas com bcryptjs
- ✅ RBAC (Role-Based Access Control)
- ✅ Proteção de rotas via middleware
- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs
- ✅ Proteção de uploads (tipo e tamanho)
- ✅ CSRF protection via NextAuth

## 📱 Funcionalidades por Papel

### DRIVER (Motorista)
- Endpoints: `/dashboard/driver/vehicles`, `/dashboard/driver/availabilities`
- Pode: Cadastrar veículos, publicar disponibilidades, receber mensagens

### CLIENT (Cliente/Empresa)
- Endpoints: `/dashboard/search`, `/dashboard/chats`
- Pode: Buscar fretes, contatar motoristas, negociar

### ADMIN
- Estrutura pronta para funcionalidades administrativas futuras

## 🔄 Fluxo de Uso

1. **Motorista** se cadastra e adiciona seus veículos
2. **Motorista** publica uma disponibilidade de retorno (origem → destino, data, capacidade)
3. **Cliente** busca por fretes disponíveis usando filtros
4. **Cliente** encontra um frete adequado e inicia contato via chat ou WhatsApp
5. Negociação direta entre as partes
6. **Motorista** marca a disponibilidade como concluída

## 🌐 Deploy

### Vercel (Recomendado)

1. Configure as variáveis de ambiente no Vercel
2. Conecte seu repositório
3. O deploy será automático

### Outras Plataformas

- Configure as variáveis de ambiente
- Execute `npm run build`
- Execute `npm run start`
- Configure o PostgreSQL acessível

## 📚 API Endpoints

### Autenticação
- `POST /api/users/register` - Registro de usuário
- `POST /api/auth/[...nextauth]` - Login (NextAuth)

### Usuários
- `GET /api/users/profile` - Obter perfil do usuário atual
- `PATCH /api/users/profile` - Atualizar perfil

### Veículos (DRIVER only)
- `GET /api/vehicles` - Listar veículos do motorista
- `POST /api/vehicles` - Criar veículo
- `GET /api/vehicles/[id]` - Detalhes do veículo
- `PATCH /api/vehicles/[id]` - Atualizar veículo
- `DELETE /api/vehicles/[id]` - Deletar veículo

### Disponibilidades
- `GET /api/availabilities` - Listar disponibilidades
- `POST /api/availabilities` - Criar disponibilidade (DRIVER)
- `GET /api/availabilities/search` - Buscar com filtros
- `GET /api/availabilities/[id]` - Detalhes
- `PATCH /api/availabilities/[id]` - Atualizar (DRIVER)
- `DELETE /api/availabilities/[id]` - Deletar (DRIVER)

### Chat
- `GET /api/chats` - Listar chats do usuário
- `POST /api/chats` - Criar/obter chat
- `GET /api/chats/[id]` - Detalhes e mensagens do chat
- `POST /api/messages` - Enviar mensagem

### Upload
- `POST /api/upload` - Upload de foto de veículo (DRIVER)
- `DELETE /api/upload?id=[photoId]` - Deletar foto (DRIVER)

## 🔮 Roadmap Futuro

- [ ] Sistema de avaliações
- [ ] Planos pagos
- [ ] Limite de postagens por plano
- [ ] Intermediação de pagamentos
- [ ] Contratos digitais
- [ ] Notificações em tempo real
- [ ] App mobile
- [ ] Dashboard administrativo completo

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Contribuindo

Para contribuir com o projeto:
1. Crie uma branch feature
2. Faça suas alterações
3. Teste completamente
4. Crie um Pull Request

## 📞 Suporte

Para questões ou suporte, entre em contato através dos canais oficiais do projeto.
