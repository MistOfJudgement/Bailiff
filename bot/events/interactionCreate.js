import {Events} from "discord.js";
import Log from "../../log.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        Log(`[${this.name}]: ${interaction.commandName}`);
        const command = interaction.client.commands.get(interaction.commandName);
        if(!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            Log(error);
            await interaction.reply({content: "There was an error. Whoops", ephemeral:true});
        }
    }
}