import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { createId } from "@paralleldrive/cuid2";
import { isAdmin } from "@/lib/auth";

// GET single menu item (Public - no admin check needed)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: id },
    });
    
    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      ...menuItem,
      price: Number(menuItem.price),
      discountedPrice: menuItem.discountedPrice ? Number(menuItem.discountedPrice) : undefined,
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 }
    );
  }
}

// PUT update menu item (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
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
    
    // Get existing menu item to check for old image
    const existingItem = await prisma.menuItem.findUnique({
      where: { id: id },
    });
    
    if (!existingItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }
    
    // Handle image upload
    let imageUrl = existingItem.image;
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingItem.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingItem.image);
        try {
          await unlink(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      
      // Save new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileExtension = imageFile.name.split(".").pop();
      const filename = `${createId()}.${fileExtension}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/menu");
      const filePath = path.join(uploadDir, filename);
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, buffer);
      
      imageUrl = `/uploads/menu/${filename}`;
    }
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check if slug already exists and is not the current item
    const existingSlug = await prisma.menuItem.findFirst({
      where: {
        slug,
        NOT: { id: id }
      },
    });
    
    let finalSlug = slug;
    if (existingSlug) {
      finalSlug = `${slug}-${createId().substring(0, 8)}`;
    }
    
    // Update menu item
    const menuItem = await prisma.menuItem.update({
      where: { id: id },
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
      },
    });
    
    return NextResponse.json({
      ...menuItem,
      price: Number(menuItem.price),
      discountedPrice: menuItem.discountedPrice ? Number(menuItem.discountedPrice) : undefined,
    });
    
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE menu item (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Get existing menu item to delete its image
    const existingItem = await prisma.menuItem.findUnique({
      where: { id: id },
    });
    
    if (!existingItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }
    
    // Delete image file if exists
    if (existingItem.image) {
      const imagePath = path.join(process.cwd(), "public", existingItem.image);
      try {
        await unlink(imagePath);
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }
    
    // Delete menu item from database
    await prisma.menuItem.delete({
      where: { id: id },
    });
    
    return NextResponse.json(
      { message: "Menu item deleted successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}