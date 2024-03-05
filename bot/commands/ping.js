import {SlashCommandBuilder} from "discord.js";
import Log from "../../log.js";
const temp = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("it will ping you"),
    async execute(interaction) {
        Log("[slash-ping] " + interaction.commandName);
        return interaction.reply(`get pinged idot <@${interaction.user.id}>`);
    }
}
export default temp;