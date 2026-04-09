import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createId } from "@paralleldrive/cuid2";
import { isAdmin } from "@/lib/auth";

// GET all menu items (Public - no admin check needed for viewing)
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    
    // Transform data to match frontend expectations
    const transformedItems = menuItems.map(item => ({
      ...item,
      price: Number(item.price),
      discountedPrice: item.discountedPrice ? Number(item.discountedPrice) : undefined,
      popularityTag: item.popularityTag,
    }));
    
    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST new menu item (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const isDiscount = formData.get("isDiscount") === "true";
    const discountedPrice = isDiscount ? parseFloat(formData.get("discountedPrice") as string) : null;
    const preparationTime = parseInt(formData.get("preparationTime") as string);
    const popularityTag = formData.get("popularityTag") as string || null;
    const isVeg = formData.get("isVeg") === "true";
    const isAvailable = formData.get("isAvailable") === "true";
    const imageFile = formData.get("image") as File | null;
    
    // Validate required fields
    if (!name || !price || !preparationTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check if slug already exists
    const existingSlug = await prisma.menuItem.findUnique({
      where: { slug },
    });
    
    let finalSlug = slug;
    if (existingSlug) {
      // Append random string to make slug unique
      finalSlug = `${slug}-${createId().substring(0, 8)}`;
    }
    
    // Handle image upload
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename using cuid2
      const fileExtension = imageFile.name.split(".").pop();
      const filename = `${createId()}.${fileExtension}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/menu");
      const filePath = path.join(uploadDir, filename);
      
      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });
      
      // Save file
      await writeFile(filePath, buffer);
      
      // Store relative path for database
      imageUrl = `/uploads/menu/${filename}`;
    }
    
    // Create menu item in database
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price,
        isDiscount,
        discountedPrice,
        preparationTime,
        popularityTag: popularityTag as any || null,
        isVeg,
        isAvailable,
        image: imageUrl,
        slug: finalSlug,
        rating: 0, // Default rating
      },
    });
    
    return NextResponse.json({
      ...menuItem,
      price: Number(menuItem.price),
      discountedPrice: menuItem.discountedPrice ? Number(menuItem.discountedPrice) : undefined,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}