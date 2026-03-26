import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool: any = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const tagsParam = searchParams.get('tags');
    const tagsArray = tagsParam ? tagsParam.split(',') : [];

    // สร้างเงื่อนไขการค้นหา
    const whereCondition = tagsArray.length > 0 
      ? { hashtags: { hasSome: tagsArray } } 
      : {};

    // 1. ดึงข้อมูลที่ตรงเงื่อนไขมาทั้งหมดก่อนเพื่อทำ Scoring
    const allMatchingImages = await prisma.image.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' } 
    });

    // 2. ระบบให้คะแนนความแม่นยำ (Scoring)
    // ถ้าเลือกหลาย Tag รูปที่มี Tag ตรงมากกว่าจะอยู่บนสุด
    let sortedImages = [...allMatchingImages];
    if (tagsArray.length > 1) {
      sortedImages.sort((a, b) => {
        const aScore = a.hashtags.filter((tag: string) => tagsArray.includes(tag)).length;
        const bScore = b.hashtags.filter((tag: string) => tagsArray.includes(tag)).length;
        return bScore - aScore;
      });
    }

    // 3. จัดการแบ่งหน้า (Pagination)
    const paginatedImages = sortedImages.slice(skip, skip + limit);
    const totalImages = sortedImages.length;
    const hasNextPage = skip + limit < totalImages;

    return NextResponse.json({
      images: paginatedImages,
      nextPage: hasNextPage ? page + 1 : null
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}