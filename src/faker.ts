import {faker} from '@faker-js/faker';
import fs from 'fs';

const TOTAL_LOCATIONS = 100;

const locations = Array.from({length: TOTAL_LOCATIONS}, (v, i) => faker.location.country().replace('\'', ''));

const locationsSQL =  Array.from(new Set(locations)).map((l) => `('${l}')`).join(',');

const sql = `
INSERT INTO "Category"(category_name)
VALUES ${locationsSQL};
`

fs.writeFileSync(`${process.cwd()}/src/query/insert_categories.sql`, sql);
