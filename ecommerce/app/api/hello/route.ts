export async function GET() {
    return new Response("Hello, Next.js!", { status: 200 });
}

export async function POST() {
    return new Response("POST request received!", { status: 200 });
}