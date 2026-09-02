import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
});

async function testChroma() {
    try {
        const heartbeat = await client.heartbeat();

        console.log("Chroma is working!");
        console.log("Heartbeat:", heartbeat);
    } catch (error) {
        console.error("Chroma connection failed:");
        console.error(error);
    }
}

testChroma();