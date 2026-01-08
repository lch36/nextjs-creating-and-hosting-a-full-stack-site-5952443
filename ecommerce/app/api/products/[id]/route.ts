import { NextResponse } from "next/server";
import { products } from "@/app/product-data";       

export async function GET( request: NextResponse, { params }: { params: { id: string } } ) {
    const productId = params.id;
    const product = products.find((p) => p.id === productId);

    if (!product) {
        return new Response("Product not found", { status: 404 });
    }

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}