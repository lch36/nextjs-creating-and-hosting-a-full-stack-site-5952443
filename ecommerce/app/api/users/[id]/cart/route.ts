import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { products } from "@/app/product-data";
import { connectToDb } from "../../../db";

type ShoppingCart = Record<string, string[]>;
type CartBody = { productId: string };

const carts: ShoppingCart = {
    '1': ['123', '234'],
    '2': ['345', '456'],
    '3': ['234'],
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { db } = await connectToDb();

    const userId = params.id;
    const userCart = await db.collection("carts").findOne({ userId });
  
    if (!userCart || !userCart.cardIds) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const cartProducts = await db.collection("products").find({ id: { $in: userCart.cardIds } }).toArray();

    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { db } = await connectToDb();

    const userId = params.id;
    const body: CartBody = await request.json();
    const newProductId = body.productId;

    const updatedCart = await db.collection("carts").findOneAndUpdate(
        { userId },
        { $push: { cardIds: newProductId } as any },
        { upsert: true, returnDocument: 'after' },
    );

    revalidatePath('/cart');

    if (!updatedCart || !updatedCart.cardIds) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const cartProducts = await db.collection("products").find({ id: { $in: updatedCart.cardIds } }).toArray();
    return new Response(JSON.stringify(cartProducts), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Function for removing a product from the cart
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { db } = await connectToDb();

    const userId = params.id;
    const body: CartBody = await request.json();
    const removeProductId = body.productId;

    const updatedCart = await db.collection("carts").findOneAndUpdate(
        { userId },
        { $pull: { cardIds: removeProductId } as any },
        { returnDocument: 'after' },
    );

    revalidatePath('/cart');
    
    if(!updatedCart || !updatedCart.cardIds){
        return new Response(JSON.stringify([]), {
            status: 202,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const cartProducts = await db.collection("products").find({ id: { $in: updatedCart.cardIds } }).toArray();
    
    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}