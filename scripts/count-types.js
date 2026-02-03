const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/recipes.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const counts = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
    total: 0
};

rawData.forEach(r => {
    if (!r.title || r.title.length <= 3) return; // Matches adapter filter

    let type = 'snack';
    if (r.file) {
        if (r.file.includes('Cafe')) type = 'breakfast';
        else if (r.file.includes('Almo')) type = 'lunch';
        else if (r.file.includes('Jantar')) type = 'dinner';
    }

    counts[type]++;
    counts.total++;
});

console.log('Distribution:', counts);
