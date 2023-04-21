import {Events} from "discord.js";


export default {
    name: Events.InteractionCreate,
    once: false,
    Log: console,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        this.Log.info(`[${this.name}]: ${interaction.commandName}`);
        const command = interaction.client.commands.get(interaction.commandName);
        if(!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            this.Log.error(error);
            await interaction.reply({content: "There was an error. Whoops", ephemeral:true});
        }
    }
}