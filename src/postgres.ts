import config from 'config';
import * as path from 'path';
import * as fs from 'fs';
import {Client} from 'pg';

let client: Client;

export const queries: {[key: string]: string} = {};

function loadQueries() {
	const queriesPath = path.join(__dirname, 'query');
	fs.readdirSync(queriesPath).forEach(file => {
		queries[file.replace('.sql', '')] = fs.readFileSync(path.join(queriesPath, file)).toString();
	});
	Object.freeze(queries);
}

async function runSeedQueries(): Promise<void> {
	const seedQueries = ['create_table_user', 'create_table_category', 'create_table_user_category' ,
	// 'insert_categories'
];
	const client = getClient();
	await Promise.allSettled(seedQueries.map(async query => {
		const res = await client.query(queries[query]);
		console.log(`Query ${query} executed successfully`);
	}));
}


export async function init() {
	if (!client) {
		loadQueries();
		client = new Client(config.get('postgres'));
		await client.connect();
		console.log('Connected to Postgres');
		await runSeedQueries();
	}
}

export function getClient(): Client {
	if (!client) {
		throw new Error('Client not initialized!');
	}
	return client;
}
