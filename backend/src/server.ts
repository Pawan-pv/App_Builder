// c:\my-project\soft-projects\backend\src\server.ts
import app from "./app.js";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3000;

async function bootstrap() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("📂 Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();