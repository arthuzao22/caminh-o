import { PrismaClient, UserRole, VehicleType, AvailabilityStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (opcional - remover em produção)
  console.log('🗑️  Limpando dados existentes...')
  await prisma.message.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.returnAvailability.deleteMany()
  await prisma.vehiclePhoto.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()

  // Hash da senha padrão para todos os usuários
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Criar usuários motoristas
  console.log('👤 Criando usuários motoristas...')
  const driver1 = await prisma.user.create({
    data: {
      email: 'joao.silva@example.com',
      password: hashedPassword,
      name: 'João Silva',
      phone: '(11) 98765-4321',
      role: UserRole.DRIVER,
      whatsapp: '5511987654321',
      cpfCnpj: '123.456.789-00',
      driverLicense: '12345678901',
      companyName: 'Transportes Silva Ltda',
    },
  })

  const driver2 = await prisma.user.create({
    data: {
      email: 'maria.santos@example.com',
      password: hashedPassword,
      name: 'Maria Santos',
      phone: '(21) 99876-5432',
      role: UserRole.DRIVER,
      whatsapp: '5521998765432',
      cpfCnpj: '234.567.890-11',
      driverLicense: '23456789012',
      companyName: 'M. Santos Transportes',
    },
  })

  const driver3 = await prisma.user.create({
    data: {
      email: 'carlos.oliveira@example.com',
      password: hashedPassword,
      name: 'Carlos Oliveira',
      phone: '(41) 97765-4321',
      role: UserRole.DRIVER,
      whatsapp: '5541977654321',
      cpfCnpj: '345.678.901-22',
      driverLicense: '34567890123',
    },
  })

  // Criar usuários clientes
  console.log('👥 Criando usuários clientes...')
  const client1 = await prisma.user.create({
    data: {
      email: 'ana.costa@example.com',
      password: hashedPassword,
      name: 'Ana Costa',
      phone: '(11) 96543-2109',
      role: UserRole.CLIENT,
      whatsapp: '5511965432109',
      cpfCnpj: '456.789.012-33',
    },
  })

  const client2 = await prisma.user.create({
    data: {
      email: 'pedro.martins@example.com',
      password: hashedPassword,
      name: 'Pedro Martins',
      phone: '(19) 95432-1098',
      role: UserRole.CLIENT,
      whatsapp: '5519954321098',
      cpfCnpj: '12.345.678/0001-90',
    },
  })

  const client3 = await prisma.user.create({
    data: {
      email: 'juliana.ferreira@example.com',
      password: hashedPassword,
      name: 'Juliana Ferreira',
      phone: '(21) 94321-0987',
      role: UserRole.CLIENT,
      cpfCnpj: '23.456.789/0001-01',
    },
  })

  // Criar administrador
  console.log('🔐 Criando usuário administrador...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@retorno.com',
      password: hashedPassword,
      name: 'Administrador',
      role: UserRole.ADMIN,
      cpfCnpj: '000.000.000-00',
    },
  })

  // Criar veículos para motoristas
  console.log('🚛 Criando veículos...')
  const vehicle1 = await prisma.vehicle.create({
    data: {
      userId: driver1.id,
      type: VehicleType.TRUCK_LARGE,
      brand: 'Scania',
      model: 'R 450',
      year: 2020,
      plate: 'ABC1D23',
      capacity: 25,
      description: 'Caminhão truck em excelente estado, com baú refrigerado',
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      userId: driver1.id,
      type: VehicleType.TRUCK_SEMI,
      brand: 'Volvo',
      model: 'FH 540',
      year: 2019,
      plate: 'DEF4G56',
      capacity: 40,
      description: 'Carreta com carroceria aberta para cargas diversas',
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      userId: driver2.id,
      type: VehicleType.TRUCK_MEDIUM,
      brand: 'Mercedes-Benz',
      model: 'Atego 1719',
      year: 2021,
      plate: 'GHI7J89',
      capacity: 12,
      description: 'Caminhão toco ideal para cargas urbanas',
    },
  })

  const vehicle4 = await prisma.vehicle.create({
    data: {
      userId: driver3.id,
      type: VehicleType.VAN,
      brand: 'Iveco',
      model: 'Daily',
      year: 2022,
      plate: 'JKL0M12',
      capacity: 3.5,
      description: 'Van baú para pequenas entregas e cargas leves',
    },
  })

  const vehicle5 = await prisma.vehicle.create({
    data: {
      userId: driver3.id,
      type: VehicleType.TRUCK_LARGE,
      brand: 'DAF',
      model: 'XF',
      year: 2018,
      plate: 'MNO3P45',
      capacity: 28,
      description: 'Caminhão truck com rastreamento e seguro total',
    },
  })

  // Criar fotos para veículos
  console.log('📸 Criando fotos de veículos...')
  await prisma.vehiclePhoto.createMany({
    data: [
      { vehicleId: vehicle1.id, url: '/uploads/vehicles/scania-r450-1.jpg', isPrimary: true },
      { vehicleId: vehicle1.id, url: '/uploads/vehicles/scania-r450-2.jpg', isPrimary: false },
      { vehicleId: vehicle2.id, url: '/uploads/vehicles/volvo-fh540-1.jpg', isPrimary: true },
      { vehicleId: vehicle3.id, url: '/uploads/vehicles/mercedes-atego-1.jpg', isPrimary: true },
      { vehicleId: vehicle4.id, url: '/uploads/vehicles/iveco-daily-1.jpg', isPrimary: true },
      { vehicleId: vehicle5.id, url: '/uploads/vehicles/daf-xf-1.jpg', isPrimary: true },
    ],
  })

  // Criar disponibilidades de retorno
  console.log('📍 Criando disponibilidades de retorno...')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const twoWeeks = new Date(today)
  twoWeeks.setDate(twoWeeks.getDate() + 14)

  const availability1 = await prisma.returnAvailability.create({
    data: {
      userId: driver1.id,
      vehicleId: vehicle1.id,
      originCity: 'Rio de Janeiro',
      originState: 'RJ',
      destinationCity: 'São Paulo',
      destinationState: 'SP',
      availableDate: tomorrow,
      flexibleDates: true,
      status: AvailabilityStatus.ACTIVE,
      priceEstimate: 2000,
      availableCapacity: 25,
      description: 'Retorno de entrega, capacidade total disponível',
      observations: 'Aceito cargas frigoríficas',
    },
  })

  const availability2 = await prisma.returnAvailability.create({
    data: {
      userId: driver1.id,
      vehicleId: vehicle2.id,
      originCity: 'Belo Horizonte',
      originState: 'MG',
      destinationCity: 'Curitiba',
      destinationState: 'PR',
      availableDate: nextWeek,
      flexibleDates: false,
      status: AvailabilityStatus.ACTIVE,
      priceEstimate: 3500,
      availableCapacity: 40,
      description: 'Viagem programada, espaço completo disponível',
    },
  })

  const availability3 = await prisma.returnAvailability.create({
    data: {
      userId: driver2.id,
      vehicleId: vehicle3.id,
      originCity: 'Campinas',
      originState: 'SP',
      destinationCity: 'Rio de Janeiro',
      destinationState: 'RJ',
      availableDate: tomorrow,
      flexibleDates: true,
      status: AvailabilityStatus.ACTIVE,
      priceEstimate: 1500,
      availableCapacity: 12,
      description: 'Retorno após entrega matinal',
      observations: 'Saída prevista para tarde',
    },
  })

  const availability4 = await prisma.returnAvailability.create({
    data: {
      userId: driver3.id,
      vehicleId: vehicle4.id,
      originCity: 'São Paulo',
      originState: 'SP',
      destinationCity: 'Santos',
      destinationState: 'SP',
      availableDate: tomorrow,
      flexibleDates: true,
      status: AvailabilityStatus.ACTIVE,
      priceEstimate: 500,
      availableCapacity: 3.5,
      description: 'Retorno diário para o porto',
    },
  })

  const availability5 = await prisma.returnAvailability.create({
    data: {
      userId: driver3.id,
      vehicleId: vehicle5.id,
      originCity: 'Curitiba',
      originState: 'PR',
      destinationCity: 'Florianópolis',
      destinationState: 'SC',
      availableDate: twoWeeks,
      flexibleDates: false,
      status: AvailabilityStatus.ACTIVE,
      priceEstimate: 2800,
      availableCapacity: 28,
      description: 'Viagem programada com data fixa',
      observations: 'Documentação completa necessária',
    },
  })

  // Criar disponibilidade inativa (exemplo)
  await prisma.returnAvailability.create({
    data: {
      userId: driver2.id,
      vehicleId: vehicle3.id,
      originCity: 'Porto Alegre',
      originState: 'RS',
      destinationCity: 'Curitiba',
      destinationState: 'PR',
      availableDate: today,
      flexibleDates: false,
      status: AvailabilityStatus.COMPLETED,
      priceEstimate: 2200,
      availableCapacity: 12,
      description: 'Viagem já realizada',
    },
  })

  // Criar chats
  console.log('💬 Criando conversas...')
  const chat1 = await prisma.chat.create({
    data: {
      participant1Id: client1.id,
      participant2Id: driver1.id,
    },
  })

  const chat2 = await prisma.chat.create({
    data: {
      participant1Id: client2.id,
      participant2Id: driver2.id,
    },
  })

  const chat3 = await prisma.chat.create({
    data: {
      participant1Id: client3.id,
      participant2Id: driver3.id,
    },
  })

  // Criar mensagens
  console.log('✉️  Criando mensagens...')
  const oneDayAgo = new Date(today)
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  const oneHourAgo = new Date(today)
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)
  const thirtyMinAgo = new Date(today)
  thirtyMinAgo.setMinutes(thirtyMinAgo.getMinutes() - 30)

  await prisma.message.createMany({
    data: [
      // Chat 1: Cliente 1 e Motorista 1
      {
        chatId: chat1.id,
        senderId: client1.id,
        content: 'Olá! Vi sua disponibilidade de retorno Rio-SP. Ainda está disponível?',
        read: true,
        createdAt: oneDayAgo,
      },
      {
        chatId: chat1.id,
        senderId: driver1.id,
        content: 'Boa tarde! Sim, está disponível. Qual seria a carga?',
        read: true,
        createdAt: oneDayAgo,
      },
      {
        chatId: chat1.id,
        senderId: client1.id,
        content: 'São 15 toneladas de produtos eletrônicos. Precisa de refrigeração.',
        read: true,
        createdAt: oneDayAgo,
      },
      {
        chatId: chat1.id,
        senderId: driver1.id,
        content: 'Perfeito! Meu caminhão tem baú refrigerado. Podemos fechar por R$ 2.000.',
        read: false,
        createdAt: oneHourAgo,
      },

      // Chat 2: Cliente 2 e Motorista 2
      {
        chatId: chat2.id,
        senderId: client2.id,
        content: 'Boa tarde! Preciso transportar materiais de construção de Campinas para o Rio.',
        read: true,
        createdAt: oneDayAgo,
      },
      {
        chatId: chat2.id,
        senderId: driver2.id,
        content: 'Olá! Tenho disponibilidade amanhã à tarde. Quantas toneladas?',
        read: true,
        createdAt: oneHourAgo,
      },
      {
        chatId: chat2.id,
        senderId: client2.id,
        content: 'Cerca de 10 toneladas. Qual o preço?',
        read: false,
        createdAt: thirtyMinAgo,
      },

      // Chat 3: Cliente 3 e Motorista 3
      {
        chatId: chat3.id,
        senderId: client3.id,
        content: 'Olá! Você faz entregas em Santos?',
        read: true,
        createdAt: thirtyMinAgo,
      },
      {
        chatId: chat3.id,
        senderId: driver3.id,
        content: 'Sim! Faço viagens diárias SP-Santos. Como posso ajudar?',
        read: false,
        createdAt: thirtyMinAgo,
      },
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log('\n📊 Resumo:')
  console.log(`   👤 ${await prisma.user.count()} usuários criados`)
  console.log(`   🚛 ${await prisma.vehicle.count()} veículos criados`)
  console.log(`   📸 ${await prisma.vehiclePhoto.count()} fotos de veículos`)
  console.log(`   📍 ${await prisma.returnAvailability.count()} disponibilidades criadas`)
  console.log(`   💬 ${await prisma.chat.count()} conversas criadas`)
  console.log(`   ✉️  ${await prisma.message.count()} mensagens criadas`)
  console.log('\n🔑 Credenciais de teste (senha para todos: 123456):')
  console.log('   Motoristas:')
  console.log('   - joao.silva@example.com')
  console.log('   - maria.santos@example.com')
  console.log('   - carlos.oliveira@example.com')
  console.log('   Clientes:')
  console.log('   - ana.costa@example.com')
  console.log('   - pedro.martins@example.com')
  console.log('   - juliana.ferreira@example.com')
  console.log('   Admin:')
  console.log('   - admin@retorno.com')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
