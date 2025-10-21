import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function seed() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email:email },
    update: {
      password: hashedPassword,
      name: "Arman Mia",
      role: "admin",
      picture: "https://i.ibb.co/0f0Q3Fp/admin-avatar.png",
    },
    create: {
      name: "Arman Mia",
      email:email,
      password: hashedPassword,
      role: "admin",
      picture: "https://i.ibb.co/0f0Q3Fp/admin-avatar.png",
    },
  });


  console.log("user seeded successfully", admin.email);
}


export default seed;