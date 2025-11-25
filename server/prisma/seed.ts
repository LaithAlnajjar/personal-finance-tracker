import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const FIXED_EXPENSES = [
  { name: 'Rent', merchant: 'Landlord', amount: 250, category: 'Housing' },
  { name: 'Orange Fiber', merchant: 'Orange', amount: 25, category: 'Utilities' },
  { name: 'Zain Postpaid', merchant: 'Zain', amount: 15, category: 'Utilities' },
  { name: 'Netflix', merchant: 'Netflix', amount: 8, category: 'Entertainment' },
];

// 2. Define "Daily Life" (Cheap, Frequent)
const DAILY_EXPENSES = [
  {
    merchants: ['Abu Jbara', 'Al Kalha', 'Shawerma Reem', 'Firefly'],
    category: 'Dining',
    range: [2.5, 8],
  }, // JOD
  {
    merchants: ['Starbucks', 'Astrolabe', 'Dunkin', 'University Cafeteria'],
    category: 'Dining',
    range: [3, 6],
  },
  {
    merchants: ['Careem', 'Uber', 'Taxi', 'Bus'],
    category: 'Transport',
    range: [1, 5],
  },
  { merchants: ['Supermarket'], category: 'Groceries', range: [2, 10] },
];

// 3. Define "Weekly/Occasional" (More expensive, less frequent)
const WEEKLY_EXPENSES = [
  {
    merchants: ['Carrefour', 'Cozmo', 'Miles', 'Kareem Hypermarket'],
    category: 'Groceries',
    range: [20, 60],
  },
  { merchants: ['Manaseer Gas', 'JoPetrol', 'Total'], category: 'Transport', range: [15, 30] },
  { merchants: ['City Mall', 'Taj Mall', 'Mecca Mall'], category: 'Shopping', range: [20, 80] },
  { merchants: ['Steam Games', 'PlayStation Store'], category: 'Entertainment', range: [10, 50] },
];

function getRandomAmount(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function main() {
  console.log('🌱 Starting Realistic Jordanian Seeding...');

  const DEMO_EMAIL = 'test@test.com';
  const DEMO_PASSWORD = 'test';
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: 'test',
      password: hashedPassword,
    },
  });
  console.log(`👤 User ready: ${user.email}`);

  const allCategoryNames = [
    'Housing',
    'Utilities',
    'Entertainment',
    'Dining',
    'Transport',
    'Groceries',
    'Shopping',
  ];

  const categoryMap: Record<string, string> = {};

  for (const name of allCategoryNames) {
    const cat = await prisma.category
      .upsert({
        where: {
          id: 'temp-id',
        },
        update: {},
        create: { name, userId: user.id },
      })
      .catch(async () => {
        const existing = await prisma.category.findFirst({ where: { name, userId: user.id } });
        if (existing) return existing;
        return prisma.category.create({ data: { name, userId: user.id } });
      });
    categoryMap[name] = cat.id;
  }

  const expenses = [];
  const today = new Date();
  const DAYS_TO_SIMULATE = 365;

  for (let i = 0; i < DAYS_TO_SIMULATE; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() - i);
    const isWeekend = currentDate.getDay() === 5 || currentDate.getDay() === 6;
    const dayOfMonth = currentDate.getDate();

    if (dayOfMonth === 1) {
      for (const bill of FIXED_EXPENSES) {
        expenses.push({
          userId: user.id,
          title: `${bill.name} Bill`,
          merchant: bill.merchant,
          amount: bill.amount,
          date: currentDate,
          categoryId: categoryMap[bill.category],
        });
      }
    }
    if (Math.random() > 0.2) {
      const itemsToday = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < itemsToday; j++) {
        const pattern = DAILY_EXPENSES[Math.floor(Math.random() * DAILY_EXPENSES.length)];
        const merchant = pattern.merchants[Math.floor(Math.random() * pattern.merchants.length)];
        expenses.push({
          userId: user.id,
          title: `${merchant} Purchase`,
          merchant: merchant,
          amount: getRandomAmount(pattern.range[0], pattern.range[1]),
          date: currentDate,
          categoryId: categoryMap[pattern.category],
        });
      }
    }

    const probability = isWeekend ? 0.6 : 0.1;
    if (Math.random() < probability) {
      const pattern = WEEKLY_EXPENSES[Math.floor(Math.random() * WEEKLY_EXPENSES.length)];
      const merchant = pattern.merchants[Math.floor(Math.random() * pattern.merchants.length)];
      expenses.push({
        userId: user.id,
        title: `${merchant} Purchase`,
        merchant: merchant,
        amount: getRandomAmount(pattern.range[0], pattern.range[1]),
        date: currentDate,
        categoryId: categoryMap[pattern.category],
      });
    }
  }

  console.log(`📝 Inserting ${expenses.length} realistic expenses...`);
  await prisma.expense.createMany({ data: expenses });
  console.log('✅ Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
