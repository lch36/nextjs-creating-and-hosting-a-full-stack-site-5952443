import { NextRequest } from "next/server";
import { products } from "@/app/product-data";

type ShoppingCart = Record<string, string[]>;
type CartBody = { productId: string };

const carts: ShoppingCart = {
    '1': ['123', '234'],
    '2': ['345', '456'],
    '3': ['234'],
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    const productIDs = carts[userId];
    const cartProducts = productIDs?.map(id => products.find(p => p.id === id)).filter(p => p !== undefined);

    if (!cartProducts) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    const body: CartBody = await request.json();
    const newProductId = body.productId;

    carts[userId] = carts[userId] ? carts[userId].concat([newProductId]) : [newProductId];
    const productIDs = carts[userId];
    const cartProducts = productIDs?.map(id => products.find(p => p.id === id)).filter(p => p !== undefined);

    return new Response(JSON.stringify(cartProducts), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Function for removing a product from the cart
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;
    const body: CartBody = await request.json();
    const removeProductId = body.productId;
    carts[userId] = carts[userId]?.filter(id => id !== removeProductId) || [];
    const productIDs = carts[userId];
    
    const cartProducts = productIDs?.map(id => products.find(p => p.id === id)).filter(p => p !== undefined);  
    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}