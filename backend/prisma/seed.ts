import { PrismaClient, UserRole, AppStatus, LessonType, PaymentStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding admin & demo data...");

  // --------------------
  // PASSWORD
  // --------------------
  const passwordHash = await bcrypt.hash("password123", 10);

  // --------------------
  // ADMIN
  // --------------------
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      password: passwordHash,
      role: UserRole.ADMIN,
      name: "Platform Admin",
    },
  });

  // --------------------
  // CREATOR
  // --------------------
  const creator = await prisma.user.upsert({
    where: { email: "creator@demo.com" },
    update: {},
    create: {
      email: "creator@demo.com",
      password: passwordHash,
      role: UserRole.CREATOR,
      name: "Demo Creator",
    },
  });

  // --------------------
  // END USER
  // --------------------
  const user = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      email: "user@demo.com",
      password: passwordHash,
      role: UserRole.END_USER,
      name: "Demo User",
    },
  });

  // --------------------
  // APP
  // --------------------
  const app = await prisma.app.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Demo Learning App",
      status: AppStatus.LIVE,
      creatorId: creator.id,
      themeJson: {
        primaryColor: "#0062FF",
        fontFamily: "Roboto",
      },
      settings: {
        create: {
          analyticsEnabled: true,
          featureFlags: {
            quizzes: true,
            certificates: true,
          },
        },
      },
    },
  });

  // --------------------
  // COURSE
  // --------------------
  const course = await prisma.course.create({
    data: {
      appId: app.id,
      title: "Flutter Basics",
      description: "Learn Flutter from scratch",
      orderIndex: 1,
    },
  });

  // --------------------
  // LESSONS
  // --------------------
  const lessons = await prisma.lesson.createMany({
    data: [
      {
        appId: app.id,
        courseId: course.id,
        title: "Introduction to Flutter",
        contentType: LessonType.VIDEO,
        videoUrl: "https://example.com/video1.mp4",
        durationSec: 300,
        orderIndex: 1,
      },
      {
        appId: app.id,
        courseId: course.id,
        title: "Widgets Overview",
        contentType: LessonType.VIDEO,
        videoUrl: "https://example.com/video2.mp4",
        durationSec: 420,
        orderIndex: 2,
      },
    ],
  });

  // --------------------
  // OFFER (PAID COURSE)
  // --------------------
  const offer = await prisma.offer.create({
    data: {
      appId: app.id,
      courseId: course.id,
      price: 999,
      discountPct: 20,
    },
  });

  // --------------------
  // PAYMENT
  // --------------------
  const payment = await prisma.payment.create({
    data: {
      appId: app.id,
      userId: user.id,
      amount: 799,
      status: PaymentStatus.PAID,
    },
  });

  // --------------------
  // ENROLLMENT
  // --------------------
  const enrollment = await prisma.enrollment.upsert({
    where: {
      appId_userId_courseId: {
        appId: app.id,
        userId: user.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      appId: app.id,
      userId: user.id,
      courseId: course.id,
      status: "ACTIVE",
    },
  });

  // --------------------
  // APP VERSION (PUBLISHED)
  // --------------------
  // Inside seed.ts main() function
const version = await prisma.appVersion.create({
  data: {
    appId: app.id,
    version: "v1.0.0",
    published: true,
    schema: {
      screens: [
        {
          id: "home",
          title: "Home Screen",
          root: [ // Added a real widget tree for Flutter to render
            {
              type: "Column",
              props: { mainAxisAlignment: "center" },
              children: [
                {
                  type: "Text",
                  props: { text: "Welcome to Demo App", fontSize: 20 }
                },
                {
                  type: "Button",
                  props: { text: "Get Started", backgroundColor: "#0062FF" }
                }
              ]
            }
          ]
        }
      ],
    },
  },
});

  console.log("✅ Seed completed successfully");
  console.log({
    admin: admin.email,
    creator: creator.email,
    user: user.email,
    app: app.name,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
