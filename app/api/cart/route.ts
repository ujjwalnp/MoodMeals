import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET user's cart
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          cartItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    }

    // Transform response
    const transformedCart = {
      id: cart.id,
      items: cart.cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: Number(item.menuItem.price),
          discountedPrice: item.menuItem.discountedPrice ? Number(item.menuItem.discountedPrice) : null,
          isDiscount: item.menuItem.isDiscount,
          image: item.menuItem.image,
          description: item.menuItem.description,
        },
      })),
    };

    return NextResponse.json(transformedCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { menuItemId, quantity } = body;

    if (!menuItemId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Check if menu item exists and is available
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId, isAvailable: true },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found or unavailable" },
        { status: 404 }
      );
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_menuItemId: {
          cartId: cart.id,
          menuItemId: menuItemId,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId: menuItemId,
          quantity: quantity,
        },
      });
    }

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // Transform response
    const transformedCart = {
      id: updatedCart?.id,
      items: updatedCart?.cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: Number(item.menuItem.price),
          discountedPrice: item.menuItem.discountedPrice ? Number(item.menuItem.discountedPrice) : null,
          isDiscount: item.menuItem.isDiscount,
          image: item.menuItem.image,
          description: item.menuItem.description,
        },
      })) || [],
    };

    return NextResponse.json({
      message: "Item added to cart successfully",
      cart: transformedCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// PUT update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { menuItemId, quantity } = body;

    if (!menuItemId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: {
          cartId_menuItemId: {
            cartId: cart.id,
            menuItemId: menuItemId,
          },
        },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          cartId_menuItemId: {
            cartId: cart.id,
            menuItemId: menuItemId,
          },
        },
        data: { quantity },
      });
    }

    return NextResponse.json({
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE clear cart or remove specific item
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const menuItemId = url.searchParams.get("menuItemId");

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    if (menuItemId) {
      // Remove specific item
      await prisma.cartItem.delete({
        where: {
          cartId_menuItemId: {
            cartId: cart.id,
            menuItemId: menuItemId,
          },
        },
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({
      message: menuItemId ? "Item removed from cart" : "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    return NextResponse.json(
      { error: "Failed to delete from cart" },
      { status: 500 }
    );
  }
}