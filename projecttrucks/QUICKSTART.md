# RETORNO - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd projecttrucks
npm install
```

### Step 2: Configure Database
Edit `.env` file:
```env
DATABASE_URL="postgresql://postgres.lrezteapxodwskbazhwg:rQI8E4HfaXnV354c@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lrezteapxodwskbazhwg:rQI8E4HfaXnV354c@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="retorno-marketplace-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Run Migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Start Application
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 👤 Testing the Application

### Create Driver Account
1. Go to http://localhost:3000
2. Click "Cadastrar"
3. Fill form:
   - Select "Motorista"
   - Name: "João Silva"
   - Email: "joao@example.com"
   - Password: "123456"
   - CNH: "12345678901"
4. Click "Criar Conta"
5. Login with credentials

### Add a Vehicle (as Driver)
1. After login, go to "Meus Veículos"
2. Click "+ Adicionar Veículo"
3. Fill form:
   - Type: "Caminhão Truck"
   - Brand: "Scania"
   - Model: "R 450"
   - Year: 2020
   - Plate: "ABC1D23"
   - Capacity: 25
4. Click "Cadastrar Veículo"

### Post Availability (as Driver)
1. Go to "Minhas Publicações"
2. Click "+ Nova Publicação"
3. Fill form:
   - Select your vehicle
   - Origin: "São Paulo" / "SP"
   - Destination: "Rio de Janeiro" / "RJ"
   - Date: Tomorrow's date
   - Capacity: 25
   - Price (optional): 2000
4. Click "Publicar Disponibilidade"

### Search as Client
1. Logout (top right)
2. Register new account as "Cliente"
   - Email: "maria@example.com"
   - Password: "123456"
3. Login
4. Go to "Buscar Fretes"
5. Use filters to search
6. Click "Enviar Mensagem" to chat with driver

---

## 🔑 Default Test Accounts

After running the app, you can create:

**Driver Account:**
- Email: driver@test.com
- Password: test123
- Role: DRIVER

**Client Account:**
- Email: client@test.com
- Password: test123
- Role: CLIENT

---

## 📱 Main Features to Test

### As DRIVER:
- ✅ Add/edit/delete vehicles
- ✅ Upload vehicle photos
- ✅ Post return availabilities
- ✅ Manage postings (edit/delete)
- ✅ Receive messages from clients
- ✅ View chat history

### As CLIENT:
- ✅ Search for available returns
- ✅ Filter by route, date, capacity
- ✅ View driver details
- ✅ Send messages to drivers
- ✅ Contact via WhatsApp (if provided)
- ✅ View chat history

---

## 🐛 Troubleshooting

### Database Connection Error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Run: `npx prisma db push` to sync schema

### Login Not Working
- Check NEXTAUTH_SECRET is set
- Clear browser cookies
- Verify user exists in database

### Upload Not Working
- Ensure `public/uploads/vehicles` directory exists
- Check file size (< 5MB)
- Check file type (JPEG, PNG, WebP only)

### TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Restart dev server
npm run dev
```

---

## 📂 Key Directories

```
projecttrucks/
├── app/
│   ├── (auth)/           → Login & Register pages
│   ├── api/              → Backend API
│   ├── dashboard/        → Protected pages
│   │   ├── driver/       → Driver features
│   │   ├── search/       → Client search
│   │   └── chats/        → Messaging
│   └── page.tsx          → Landing page
├── lib/
│   ├── auth/             → Auth utilities
│   ├── validators/       → Input validation
│   └── prisma.ts         → DB client
└── prisma/
    └── schema.prisma     → Database schema
```

---

## 🚀 Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
DATABASE_URL="your-production-db-url"
DIRECT_URL="your-production-db-direct-url"
NEXTAUTH_SECRET="generate-strong-random-secret"
NEXTAUTH_URL="https://your-domain.com"
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Check `IMPLEMENTATION.md` for technical details
3. Review code comments
4. Check Prisma logs: `npx prisma studio`

---

**Happy Coding! 🚛💨**
