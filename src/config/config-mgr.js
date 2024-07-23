import chalk from "chalk";
import { createRequire } from "module";
import {cosmiconfigSync} from 'cosmiconfig'
import Ajv from 'ajv'
import createLogger from "../logger.js";
const require = createRequire(import.meta.url)
const schema = require("./schema.json")
const configLoader = cosmiconfigSync('tool');

const ajv = new Ajv()
const logger = createLogger("config:mgr")
export  function getConfig() {
    const result = configLoader.search(process.cwd());
    if (!result) {
     logger.warning("Could not find configuration using default")
      return { port: 1234 };
    } else {
        const isValid = ajv.validate(schema,result.config)
        if(!isValid){
    logger.warning('Invalid configuration was supplied');
      logger.highlight(ajv.errors);
      process.exit(1);
        }
      logger.debug('Found configuration', result.config);
      return result.config;
    }
}