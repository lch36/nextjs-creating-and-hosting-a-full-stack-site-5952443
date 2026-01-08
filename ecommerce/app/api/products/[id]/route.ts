import { NextRequest } from "next/server";
import { connectToDb } from "../../db";    

export async function GET( request: NextRequest, { params }: { params: { id: string } } ) {
    const { db } = await connectToDb();

    const product = await db.collection("products").findOne({ id: params.id });

    if (!product) {
        return new Response("Product not found", { status: 404 });
    }

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}