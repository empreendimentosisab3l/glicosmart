const https = require('https');

// Mock adapter logic since we can't import TS directly easily in this constrained env without build
// I will copy the PLACEHOLDERS object here to test the URLs directly.

const PLACEHOLDERS = {
    breakfast: {
        pancakes: [
            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
            'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&q=80',
            'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&q=80',
        ],
        eggs: [
            'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&q=80',
            'https://images.unsplash.com/photo-1601002283996-267923768aa2?w=500&q=80',
            'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=500&q=80',
        ],
        bread: [
            'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&q=80',
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
            'https://images.unsplash.com/photo-1600147250630-f925b4104085?w=500&q=80',
        ],
        bowl: [
            'https://images.unsplash.com/photo-1517093757279-8356c9a75d5a?w=500&q=80',
            'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=500&q=80',
            'https://images.unsplash.com/photo-1542825832-624ddb288d75?w=500&q=80',
        ],
        cake: [
            'https://images.unsplash.com/photo-1623943019808-8f553655106e?w=500&q=80',
            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80',
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80',
        ],
        generic: [
            'https://images.unsplash.com/photo-1533089862017-a0e2d1ec72ab?w=500&q=80',
            'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&q=80',
        ]
    },
    lunch: {
        salad: [
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
        ],
        meat: [
            'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
        ],
        chicken: [
            'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&q=80',
            'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80',
        ],
        fish: [
            'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80', // Salmon
            'https://images.unsplash.com/photo-1580476262798-bddd9dd90d3e?w=500&q=80', // White fish
            'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80', // Grilled
        ],
        soup: [
            'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2b?w=500&q=80',
            'https://images.unsplash.com/photo-1547592166-23acbe34001e?w=500&q=80',
        ],
        generic: [
            'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
        ]
    },
    snack: {
        cake: [
            'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80',
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
        ],
        drink: [
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80',
            'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80',
            'https://images.unsplash.com/photo-1497534547324-0ebb3f052669?w=500&q=80',
            'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',
        ],
        sauce: [
            'https://images.unsplash.com/photo-1472476443507-ebd0819fa2e6?w=500&q=80',
            'https://images.unsplash.com/photo-1596522354195-e84489e65dc8?w=500&q=80',
            'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500&q=80',
        ],
        generic: [
            'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80',
            'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?w=500&q=80',
        ],
    }
};

async function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ url, status: 'OK' });
            } else {
                resolve({ url, status: 'FAIL', code: res.statusCode });
            }
        });
        req.on('error', () => resolve({ url, status: 'ERROR' }));
        req.end();
    });
}

async function main() {
    console.log('Verifying all image links...');
    const allUrls = [];

    // Extract all URLs from the nested structure
    const traverse = (obj) => {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                allUrls.push(...obj[key]);
            } else if (typeof obj[key] === 'object') {
                traverse(obj[key]);
            }
        }
    };
    traverse(PLACEHOLDERS);

    console.log(`Checking ${allUrls.length} images...`);

    // Check in batches of 5 to generally avoid rate limiting but be fast
    const batchSize = 5;
    const failures = [];

    for (let i = 0; i < allUrls.length; i += batchSize) {
        const batch = allUrls.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(checkUrl));

        results.forEach(r => {
            if (r.status !== 'OK') {
                console.log(`❌ BROKEN: ${r.url} (${r.status} ${r.code || ''})`);
                failures.push(r.url);
            } else {
                // console.log(`✅ OK: ${r.url}`);
            }
        });
    }

    if (failures.length === 0) {
        console.log('✅ All images matched successfully!');
    } else {
        console.log(`⚠️ Found ${failures.length} broken links.`);
    }
}

main();
