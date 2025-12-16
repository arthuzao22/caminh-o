# 🌱 Seed do Banco de Dados - RETORNO

Este diretório contém o script de seed para popular o banco de dados com dados de teste.

## 📋 O que o seed cria?

### Usuários (7 no total)

#### Motoristas (3)
- **João Silva** - joao.silva@example.com
  - 2 veículos (Scania R450 e Volvo FH540)
  - 2 disponibilidades ativas
  
- **Maria Santos** - maria.santos@example.com
  - 1 veículo (Mercedes Atego)
  - 2 disponibilidades (1 ativa, 1 completa)
  
- **Carlos Oliveira** - carlos.oliveira@example.com
  - 2 veículos (Iveco Daily e DAF XF)
  - 2 disponibilidades ativas

#### Clientes (3)
- **Ana Costa** - ana.costa@example.com
- **Pedro Martins** - pedro.martins@example.com
- **Juliana Ferreira** - juliana.ferreira@example.com

#### Administrador (1)
- **Administrador** - admin@retorno.com

**Senha para todos os usuários:** `123456`

### Veículos (5 no total)
- Caminhão Scania R 450 (2020) - 25t
- Carreta Volvo FH 540 (2019) - 40t
- Caminhão Mercedes Atego (2021) - 12t
- Van Iveco Daily (2022) - 3.5t
- Caminhão DAF XF (2018) - 28t

### Disponibilidades de Retorno (6 no total)
Rotas incluídas:
- Rio de Janeiro → São Paulo
- Belo Horizonte → Curitiba
- Campinas → Rio de Janeiro
- São Paulo → Santos
- Curitiba → Florianópolis
- Porto Alegre → Curitiba (concluída)

### Conversas e Mensagens (3 chats)
- Ana Costa ↔ João Silva (4 mensagens)
- Pedro Martins ↔ Maria Santos (3 mensagens)
- Juliana Ferreira ↔ Carlos Oliveira (2 mensagens)

## 🚀 Como Executar

### Método 1: Comando NPM
```bash
npm run db:seed
```

### Método 2: Comando Prisma
```bash
npx prisma db seed
```

### Método 3: Executar diretamente
```bash
npx tsx prisma/seed.ts
```

## ⚠️ Importante

**O seed LIMPA todos os dados existentes antes de criar novos!**

Estas operações são executadas na seguinte ordem:
1. Deleta todas as mensagens
2. Deleta todos os chats
3. Deleta todas as disponibilidades
4. Deleta todas as fotos de veículos
5. Deleta todos os veículos
6. Deleta todos os usuários
7. Cria novos dados de teste

**Nunca execute em produção com dados reais!**

## 🔄 Resetar e Popular

Para limpar e popular o banco novamente:

```bash
# Reseta o banco (remove todas as tabelas)
npx prisma migrate reset

# Aplica migrations
npx prisma migrate deploy

# Executa o seed
npm run db:seed
```

Ou em um único comando:
```bash
npx prisma migrate reset --skip-seed && npm run db:seed
```

## 🧪 Testando a Aplicação

Após executar o seed, você pode:

1. **Testar como Motorista:**
   - Login: `joao.silva@example.com` / `123456`
   - Ver veículos cadastrados
   - Ver disponibilidades publicadas
   - Responder mensagens de clientes

2. **Testar como Cliente:**
   - Login: `ana.costa@example.com` / `123456`
   - Buscar disponibilidades de frete
   - Enviar mensagens para motoristas

3. **Testar como Admin:**
   - Login: `admin@retorno.com` / `123456`
   - Acesso total ao sistema

## 📝 Personalizar o Seed

Para adicionar ou modificar dados, edite o arquivo `prisma/seed.ts`:

```typescript
// Adicionar novo motorista
const driver4 = await prisma.user.create({
  data: {
    email: 'novo.motorista@example.com',
    password: hashedPassword,
    name: 'Novo Motorista',
    role: UserRole.DRIVER,
    // ... outros campos
  },
})

// Adicionar novo veículo
const vehicle6 = await prisma.vehicle.create({
  data: {
    userId: driver4.id,
    type: VehicleType.TRUCK_LARGE,
    // ... outros campos
  },
})
```

## 🔍 Verificar Dados

Após executar o seed, você pode verificar os dados:

### Via Prisma Studio
```bash
npx prisma studio
```

### Via SQL (se tiver acesso ao banco)
```sql
-- Contar usuários por role
SELECT role, COUNT(*) FROM "User" GROUP BY role;

-- Ver todas as disponibilidades ativas
SELECT * FROM "ReturnAvailability" WHERE status = 'ACTIVE';

-- Ver todos os veículos com seus donos
SELECT v.*, u.name as owner_name 
FROM "Vehicle" v 
JOIN "User" u ON v."userId" = u.id;
```

## 💡 Dicas

- Execute o seed sempre que precisar de dados limpos para testes
- Use diferentes contas de usuário para testar fluxos completos
- As mensagens têm timestamps diferentes para simular conversas reais
- Algumas disponibilidades têm datas no passado, presente e futuro

## 🐛 Solução de Problemas

### Erro: "Cannot find module 'tsx'"
```bash
npm install --save-dev tsx
```

### Erro: "Database connection failed"
Verifique se:
- O PostgreSQL está rodando
- As variáveis DATABASE_URL e DIRECT_URL estão corretas no `.env`
- Você tem permissões adequadas no banco

### Erro: "Table does not exist"
Execute as migrations primeiro:
```bash
npx prisma migrate deploy
```

---

**Criado para:** RETORNO - Marketplace de Fretes de Retorno  
**Última atualização:** Dezembro 2025
