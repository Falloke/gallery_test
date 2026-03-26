import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const tagsParam = searchParams.get('tags');
    const tagsArray = tagsParam ? tagsParam.split(',') : [];

    const whereCondition = tagsArray.length > 0 
      ? { hashtags: { hasSome: tagsArray } } 
      : {};

    // 1. ดึงข้อมูลที่ตรงเงื่อนไขมา "ทั้งหมด" ก่อน
    let allMatchingImages = await prisma.image.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' } 
    });

    if (tagsArray.length > 1) {
      allMatchingImages.sort((a: any, b: any) => {
        // นับว่าแต่ละรูปมี Tag ตรงกับที่เราค้นหากี่อัน
        const aScore = a.hashtags.filter((tag: string) => tagsArray.includes(tag)).length;
        const bScore = b.hashtags.filter((tag: string) => tagsArray.includes(tag)).length;
        return bScore - aScore;
      });
    }

    // 3. จัดการแบ่งหน้า (Pagination) ให้พอดีกับ Limit ที่ตั้งไว้
    const paginatedImages = allMatchingImages.slice(skip, skip + limit);
    const totalImages = allMatchingImages.length;
    const hasNextPage = skip + limit < totalImages;

    return NextResponse.json({
      images: paginatedImages,
      nextPage: hasNextPage ? page + 1 : null
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}