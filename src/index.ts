#! /usr/bin/env node

import {Command} from "commander";
import stationsCommand from "./commands/stations";

const program = new Command();

program.addCommand(stationsCommand);

program.parse(process.argv);
