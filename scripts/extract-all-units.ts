import fs from 'fs';
import unit07 from '../src/data/normal-english/unit-7-idioms-and-slang';
import unit08 from '../src/data/normal-english/unit-8-digital-life';
import unit09 from '../src/data/normal-english/unit-9-relationships';
import unit10 from '../src/data/normal-english/unit-10-health-emergencies';

const units = [
  { name: 'unit-7', data: unit07 },
  { name: 'unit-8', data: unit08 },
  { name: 'unit-9', data: unit09 },
  { name: 'unit-10', data: unit10 },
];

for (const { name, data } of units) {
  fs.writeFileSync(`scripts/${name}-extracted.json`, JSON.stringify(data, null, 2), 'utf8');
}
console.log('Successfully dumped units 7, 8, 9, 10');
