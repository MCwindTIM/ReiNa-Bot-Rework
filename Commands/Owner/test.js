const Discord = require('discord.js');
const superagent = require('superagent');
const cheerio = require('cheerio');
const { API, TagTypes, } = require('nhentai-api');
const { CookieJar } = require('tough-cookie');

const _httpCookie = require('http-cookie-agent/http');
const { HttpsCookieAgent: CookieAgent } = _httpCookie;

const jar = new CookieJar();
const agent = new CookieAgent({ cookies: { jar, }, });
jar.setCookie('cf_clearance=gR8wuCcpj_pcCjtzNOwQZnDlQpIG3HoEVIHWE3ht9MI-1708739619-1.0-AUg73HvTFij8FMp4JHxOEN7rleYezFgDPBxyfc4t/3Q/UyFIdNo7cDTbNCbFwG/9eM6N5l87ItgZUjq4XHs+IyU=', 'https://nhentai.net/');

const api = new API({ agent, });

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('test')
		.setDescription('開發人員測試指令'),
	async run(ReiNa, interaction) {
        await interaction.deferReply();
        let msg = await getData(interaction, ReiNa)
        return await interaction.editReply({ embeds: [msg]});
	},
};

async function getData(interaction, ReiNa){
    return new Promise((resolve, reject) => {
        api.getBook(497727).then(book => {
            console.log(book.title.pretty);
        });
    })
}