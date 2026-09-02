import embeddings from './embeddings.js';

async function testEmbeddings() {
    try {
        const result = await embeddings.embedQuery(
            'I have potato, tomato and onion'
        );

        console.log('Embedding generated successfully!');
        console.log('Vector length:', result.length);
        console.log('First 5 values:', result.slice(0, 5));
    } catch (error) {
        console.error('Embedding test failed:');
        console.error(error);
    }
}

testEmbeddings();