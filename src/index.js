#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');

const usage = () => {
	console.log(`swagger-file-generator v${pkg.version}\n\n`
		+ '\tUsage:\n\n'
		+ '\tswagger-file-generator [configFile]\n\n'
		+ '\tconfigFile\t the path to the configuration file (default: "./swagger.config.js")\n\n');
};

const version = () => console.log(`v${pkg.version}`);

const generate = (configFile) => {
	const configPath = path.isAbsolute(configFile) ? configFile : path.resolve(configFile);

	if (!fs.existsSync(configPath)) {
		throw new Error(`Config file "${configPath}" not found`);
	}

	const config = require(configPath);
	const swagger = require('swagger-jsdoc');
	const swaggerSpec = swagger(config);
	const output = JSON.stringify(swaggerSpec, null, 2);
	fs.writeFileSync('swagger.json', output);
	process.stdout.write('Created swagger.json file successfully.\n');
};

const configFilePath = process.argv[2] || path.join(process.cwd(), 'swagger.config.js');

if (configFilePath === '--help' || configFilePath === 'help') {
	usage();
	process.exit(0);
}

if (configFilePath === '--version' || configFilePath === 'version') {
	version();
	process.exit(0);
}

try {
	generate(configFilePath);
	process.exit(0);
} catch (err) {
	console.error(err);
	console.error(err.stack);
	process.exit(1);
}
