#! /usr/bin/env node

import {Command} from "commander";
import stationsCommand from "./commands/stations.js";

const program = new Command();

program.addCommand(stationsCommand);

program.parse(process.argv);
