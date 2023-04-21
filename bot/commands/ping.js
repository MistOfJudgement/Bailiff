import {SlashCommandBuilder} from "discord.js";

const temp = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("it will ping you"),
    async execute(interaction) {
        return interaction.reply(`get pinged idot <@${interaction.user.id}>`);
    }
}
export default temp;