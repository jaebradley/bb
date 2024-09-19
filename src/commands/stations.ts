import {Command} from "commander";

const stationsCommand = new Command("stations");

stationsCommand
    .command("ls")
    .alias("list")
    .description("List all station information")
    .action(() => {
        console.log("Stations to come");
    });

stationsCommand
    .command("info")
    .argument("<identifier>", "Value can be the station's unique ID, or the station name")
    .action((identifier) => {
        console.log(`Identifier value is ${identifier}`);
    })

export default stationsCommand;