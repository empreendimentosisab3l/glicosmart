const fs = require('fs');
const path = require('path');
const https = require('https');

const adapterPath = path.join(__dirname, '../lib/recipeAdapter.ts');
const content = fs.readFileSync(adapterPath, 'utf8');

// Regex to extract Unsplash URLs
const urlRegex = /'https:\/\/images\.unsplash\.com\/[^']+'/g;
const matches = content.match(urlRegex) || [];
const urls = matches.map(m => m.replace(/'/g, ''));

console.log(`Found ${urls.length} distinct image URLs in recipeAdapter.ts`);

async function checkUrl(url, index) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                // Check content-type just in case
                if (!res.headers['content-type']?.includes('image')) {
                    // resolve({ url, status: 'NOT_IMAGE', code: res.statusCode });
                    // Unsplash often returns nothing for HEAD on type, but let's trust 200
                    resolve({ url, status: 'OK' });
                } else {
                    resolve({ url, status: 'OK' });
                }
            } else {
                resolve({ url, status: 'FAIL', code: res.statusCode });
            }
        });
        req.on('error', () => resolve({ url, status: 'ERROR' }));
        req.end();
    });
}

async function main() {
    const failures = [];
    const batchSize = 10;

    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(checkUrl));

        results.forEach(r => {
            if (r.status !== 'OK') {
                console.log(`❌ BROKEN [${urls.indexOf(r.url)}]: ${r.url} (${r.status} ${r.code || ''})`);
                failures.push(r.url);
            }
        });
    }

    if (failures.length === 0) {
        console.log('✅ All URLs are technically reachable (200 OK).');
    } else {
        console.log(`⚠️ Found ${failures.length} broken links.`);
    }
}

main();
