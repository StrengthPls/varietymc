const Discord = require("discord.js");
const settings = require("./settings.json");
const moment = require("moment");
var client = new Discord.Client();

// Functions when the bot is online
client.on("ready", function() {
    var clientonmessage = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${client.user.tag}
Working on ${client.guilds.size} servers!
${client.channels.size} channels and ${client.users.size} users cached!
------------------------------------------------------
----------Bot created by Dorian349#0001-----------
------------------------------------------------------
-----------------Bot's commands logs------------------`

    console.log(clientonmessage);
    let statusArray = [
        `store.varietymc.com`,
        `play.varietymc.com`
    ];

    setInterval(function() {
        client.user.setActivity(`${statusArray[~~(Math.random() * statusArray.length)]}`, { type: settings.statusTYPE });
    }, 100000);
});

client.on("guildCreate", guild => {
    const logsServerJoin = client.channels.get(settings.logsChannelID);
    logsServerJoin.send(`The bot just joined to ${guild.name}, Owned by ${guild.owner.user.tag}`);
});

client.on("guildDelete", guild => {
    const logsServerLeave = client.channels.get(settings.logsChannelID);
    logsServerLeave.send(`The bot has been left ${guild.name}, Owned by ${guild.owner.user.tag}`);
});

client.on("guildMemberAdd", (member) => {
    const guild = member.guild;
    const embed = new Discord.RichEmbed()
    .setDescription("Welcome **" + member.user.username + "** to the __**VarietyMC**__ Discord!\n \n**Important:**\n◾ Make sure to read <#572539039207653407> for updates.\n◾ Be sure to read the <#572556915431833621>.\n \n**Informations:**\n◾ Server IP » play.varietymc.com\n◾ Store » store.varietymc.com\n◾ Website » www.varietymc.com")
    .setColor(settings.embedColor)
    .setTimestamp()
    .setFooter(settings.footerText)
    client.guilds.find(guild => guild.id === "572536892449619989").channels.find(channel => channel.name === "welcome").send(embed);
});

client.on("message", async message => {
    if (message.author.equals(client.user)) return;
    if (!message.content.startsWith(settings.botPREFIX)) return;
    if (message.author.bot) return;
    const logsCommands = client.channels.get(settings.logsChannelID);
    if  (message.channel.type == "dm") return;
    if (message.author.id == "") return;
    if (message.channel.id == "") return;
    if (message.guild.id == "") return;
    var args = message.content.substring(settings.botPREFIX.length).split(" ");

    switch (args[0]) {
        case "userinfo":
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}userinfo command!`);

        let user = message.mentions.users.first();
        if (!user) {
            return message.reply('You must mention someone!');
        }
        const mentioneduser = message.mentions.users.first();
        const joineddiscord = (mentioneduser.createdAt.getDate() + 1) + '-' + (mentioneduser.createdAt.getMonth() + 1) + '-' + mentioneduser.createdAt.getFullYear() + ' | ' + mentioneduser.createdAt.getHours() + ':' + mentioneduser.createdAt.getMinutes() + ':' + mentioneduser.createdAt.getSeconds();
        let game;
        if (user.presence.game === null) {
            game = 'Not currently Playing.';
        } else {
            game = user.presence.game.name;
        }
        let messag;
        if (user.lastMessage === null) {
            messag = 'He didnt sent a message.';
        } else {
            messag = user.lastMessage;
        }
        let status;
        if (user.presence.status === 'online') {
            status = ':green_heart:';
        } else if (user.presence.status === 'dnd') {
            status = ':heart:';
        } else if (user.presence.status === 'idle') {
            status = ':yellow_heart:';
        } else if (user.presence.status === 'offline') {
            status = ':black_heart:';
        }
        if (user.presence.status === 'offline') {
            stat = 0x000000;
        } else if (user.presence.status === 'online') {
            stat = 0x00AA4C;
        } else if (user.presence.status === 'dnd') {
            stat = 0x9C0000;
        } else if (user.presence.status === 'idle') {
            stat = 0xF7C035;
        }
      message.channel.send({embed: {
        color: 3447003,
        author: {
          name: `Got some info about ${user.username}`,
          icon_url: user.displayAvatarURL
        },
        fields: [{
            name: '**UserInfo:**',
            value: `**Username:** ${user.tag}\n**Joined Discord:** ${joineddiscord}\n**Last message:** ${messag}\n**Playing:** ${game}\n**Status:** ${status}\n**Bot?** ${user.bot}`
          },
          {
            name: 'DiscordInfo:',
            value: `**Discriminator:** ${user.discriminator}\n**ID:** ${user.id}\n**Username:** ${user.username}`
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: settings.footerText
        }
      }
    });
        break;

        case "avatar":
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}avatar command!`);
        
        if(message.mentions.users.first()) { //Check if the message has a mention in it.
            let user = message.mentions.users.first(); //Since message.mentions.users returns a collection; we must use the first() method to get the first in the collection.
            let output = user.username + "#" + user.discriminator /*Username and Discriminator*/ +
            "\nAvatar URL: " + user.avatarURL; /*The Avatar URL*/
            message.channel.sendMessage(output); //We send the output in the current channel.
        } else {
                message.reply("Please mention someone :thinking:"); //Reply with a mention saying "Invalid user."
        }
        break;

        case "announce":
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}announce command!`);
        message.delete();
        const embed = new Discord.RichEmbed()
        .setTitle("New Announce from __**VarietyMC**__!")
        .setDescription("```" + message.content.slice(settings.botPREFIX.length).slice('announce'.length + 1) + "```")
        .setColor(settings.embedColor)
        .setFooter(settings.footerText)
        .setTimestamp()
        message.channel.send(embed);
        break;

        case "serverinfo":
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}serverinfo command!`);

        let guildmessageServerInfo = message.guild;
        let createdAtServerInfo = moment(message.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');
        let channelsServerInfo = message.guild.channels.size;
        let ownerServerInfo = message.guild.owner.user.tag;
        let memberCountServerInfo = message.guild.memberCount;
        let largeServerInfo = message.guild.large;
        let regionServerInfo = message.guild.region;
        let afkServerInfo = message.guild.channels.get(message.guild.afkChannelID) === undefined ? 'None' : message.guild.channels.get(guildmessageServerInfo.afkChannelID).name;

            message.channel.send({embed: {
                color: 3447003,
                author: {
                  name: message.guild.name,
                  icon_url: message.guild.iconURL
                },
                title: "Server Information",
                fields: [{
                    name: "Channels",
                    value: `**Channel Count:** ${channelsServerInfo}\n**AFK Channel:** ${afkServerInfo}`
                  },
                  {
                    name: "Members",
                    value: `**Member Count:** ${memberCountServerInfo}\n**Owner:** ${ownerServerInfo}\n**Owner ID:** ${message.guild.owner.id}`
                  },
                  {
                    name: "More",
                    value: `**Created at:** ${createdAtServerInfo}\n**Large Guild?:** ${largeServerInfo ? 'Yes' : 'No'}\n**Region:** ${regionServerInfo}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: settings.footerText
                }
              }
            });
        break;

        case "ping":
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}ping command!`);

        var msTOcolor = (client.ping > 100) ? "15158332":"3066993"

        message.channel.send({embed: {
            color: msTOcolor,
            description: "Bot's ping: " + `\`${client.ping}ms\` 🏓`
          }
        });
        break;

        case "ban":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}ban command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}ban command!`);

        const mmss = require('ms');
        let reason = message.content.split(' ').slice(3).join(' ');
        let time = message.content.split(' ')[2];
        let guild = message.guild;
        let modlog = message.guild.channels.find('name', 'mod-log');
        let usermention = message.mentions.users.first();

        if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
            return message.reply(':lock: **You** need `BAN_MEMBERS` Permissions to execute `ban`')
        }

        if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) {
            return message.reply(':lock: **I** need `BAN_MEMBERS` Permissions to execute `ban`')
        }

        if (!modlog) {
            return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one')
        }

        if (message.mentions.users.size < 1) {
            return message.reply('You need to mention someone to Ban them!')
        }

        if (message.author.id === usermention.id) {
            return message.reply('You cant punish yourself :wink:')
        }

        if (!time) {
            return message.reply(`How much time ? **Usage:**\`~ban [@mention] [1d] [example]\``)
        }

        if (!time.match(/[1-7][s,m,h,d,w]/g)) {
            return message.reply('I need a valid time ! look at the Usage! right here: **Usage:**`~ban [@mention] [1m] [example]`')
        }

        if (!reason) {
            return message.reply(`You must give me a reason for the ban **Usage:**\`~ban [@mention] [1d] [example]\``)
        }

        if (!message.guild.member(usermention).bannable) {
            return message.reply('This member is above me in the `role chain` Can\'t ban them')
        }

        message.reply("This user has been banned from the server.");

        usermention.send(`You've just got banned from ${guild.name}  \n State reason: **${reason}** \n **Disclamer**: If the ban is not timed and Permanent you may not appeal the **BAN**!`)
        message.guild.ban(usermention, 7);
        setTimeout(() => {
            message.guild.unban(usermention.id);
        }, mmss(time));
        modlog.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            fields: [{
                name: "Ban:",
                value: `**Banned:** ${usermention.username}#${usermention.discriminator}\n**Moderator:** ${message.author.username} \n**Duration:** ${mmss(mmss(time), {long: true})} \n**Reason:** ${reason}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: settings.footerText
            }
          }
        });
        break;

        case "kick":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}kick command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}kick command!`);

        if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
            return message.reply(':lock: You dont have permissions for that')
        }
        if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) {
            return message.reply(':lock: **I** need `KICK_MEMBERS` Permissions to execute `kick`')
        }
        let usermentionkick = message.mentions.users.first();
        let reasonkick = message.content.split(' ').slice(2).join(' ');
        let modlogkick = message.guild.channels.find('name', 'mod-log');
        if (!modlogkick) {
            return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
        }
        if (message.mentions.users.size < 1) {
            return message.reply('You need to mention someone to Kick him!. **Usage:**`~kick [@mention] [example]`');
        }
        if (!reasonkick) {
            return message.reply('You must give me a reason for kick **Usage:**`~kick [@mention] [example]`');
        }
        if (!message.guild.member(usermentionkick).kickable) {
            return message.reply('This member is above me in the `role chain` Can\'t kick him');
        }
        message.guild.member(usermentionkick).kick();

        modlogkick.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            fields: [{
                name: "Kick:",
                value: `**Kicked:**${usermentionkick.username}#${usermentionkick.discriminator}\n**Moderator:** ${message.author.username} \n**Reason:** ${reasonkick}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: settings.footerText
            }
          }
        });
        break;

        case "mute":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}mute command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}mute command!`);

        if (!message.guild.member(message.author).hasPermission('MUTE_MEMBERS')) {
            message.channel.send(':lock: **I** need `MANAGE_ROLES` Permissions to execute `mute`');
            return;
        }

        if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) {
            return message.reply(':lock: **I** need `MANAGE_ROLES` Permissions to execute `mute`')
        }
        const msmute = require('ms');
        let reasonMute = message.content.split(' ').slice(3).join(' ');
        let timeMute = message.content.split(' ')[2];
        let modlogMute = message.guild.channels.find('name', 'mod-log');
        let userMute = message.mentions.users.first();
        let muteRoleMute = client.guilds.get(message.guild.id).roles.find('name', 'NotAMute');
        if (!modlogMute) {
            return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
        }

        if (!muteRoleMute) {
            return message.reply('`Please create a role called "NotAMute"`');
        }

        if (message.mentions.users.size < 1) {
            return message.reply('You need to mention someone to Mute him!.');
        }
        if (message.author.id === userMute.id) {
            return message.reply('You cant punish yourself :wink:');
        }
        if (!timeMute) {
            return message.reply('specify the time for the mute!**Usage:**`~mute [@mention] [1m] [example]`');
        }
        if (!timeMute.match(/[1-60][s,m,h,d,w]/g)) {
            return message.reply('I need a valid time ! look at the Usage! right here: **Usage:**`~mute [@mention] [1m] [example]`');
        }
        if (!reasonMute) {
            return message.reply('You must give me a reason for Mute **Usage:**`~mute [@mention] [15m] [example]`');
        }
        if (reasonMute.time < 1) {
            return message.reply('TIME?').then(message => message.delete(2000));
        }
        if (reasonMute.length < 1) {
            return message.reply('You must give me a reason for Mute');
        }
        message.guild.member(userMute).addRole(muteRoleMute)

        setTimeout(() => {
            message.guild.member(userMute).removeRole(muteRoleMute)
        }, msmute(timeMute));
        message.guild.channels.filter(textchannel => textchannel.type === 'text').forEach(cnl => {
            cnl.overwritePermissions(muteRoleMute, {
                SEND_MESSAGES: false
            });
        });

        message.reply("This user has been muted.");

        modlogMute.send({embed: {
            color: 16745560,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            fields: [{
                name: 'Mute',
                value: `**Muted:**${userMute.username}#${userMute.discriminator}\n**Moderator:** ${message.author.username}\n**Duration:** ${msmute(msmute(timeMute), {long: true})}\n**Reason:** ${reasonMute}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: settings.footerText
            }
          }
        });
        break;

        case "unmute":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}unmute command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}unmute command!`);

        let guildUnmute = message.guild;
        let argsUnmute = message.content.split(' ').slice(1);
        let argresultUnmute = args.join(' ');
        let reasonUnmute = args;
        if (!message.guild.member(message.author).hasPermission('MUTE_MEMBERS')) {
            return message.reply(':lock: **You** need `MUTE_MEMBERS` Permissions to execute `unmute`')
        }
        if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) {
            return message.reply(':lock: **I** need `MANAGE_ROLES` Permissions to execute `unmute`')
        }
        let userUnmute = message.mentions.users.first();
        let muteRoleUnmute = client.guilds.get(message.guild.id).roles.find('name', 'NotAMute');
        if (message.mentions.users.size < 1) {
            return message.reply('You need to mention someone to unmute him!.');
        }
        message.guild.member(userUnmute).removeRole(muteRoleUnmute).then(() => {
            message.channel.send(`You've succesfully unmuted ${userUnmute}`);
        });
        break;

        case "quote":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}quote command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}quote command!`);

        const fetchquote = require('snekfetch');
        fetchquote.get('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en').then(quote => {
            if (quote.body.quoteText === undefined) {
                return message.reply('Something is messing up the API try again please!');
            }

            message.channel.send({embed: {
                color: 3447003,
                author: {
                  name: 'A smart guy said once:',
                  icon_url: 'http://pngimages.net/sites/default/files/right-double-quotation-mark-png-image-80280.png'
                },
                fields: [{
                    name: "Quote with source",
                    value: `"${quote.body.quoteText}"\n**Author:** ${quote.body.quoteAuthor}\n**Source:** ${quote.body.quoteLink}`
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: settings.footerText
                }
            }
        })
        });
        break;

        case "notice":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}notice command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}notice command!`);

        var hugs = [
            "`＼(^o^)／`",
            "`d=(´▽｀)=b`",
            "`⊂((・▽・))⊃`",
            "`⊂( ◜◒◝ )⊃`",
            "`⊂（♡⌂♡）⊃`",
            "`⊂(◉‿◉)つ`"
        ];
        message.reply(`${hugs[~~(Math.random() * hugs.length)]}`);
        break;

        case "softban":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}softban command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}softban command!`);

        let reasonSoftban = message.content.split(' ').slice(7).join(' ');
        let timeSoftban = message.content.split(' ')[2];
        let guildSoftban = message.guild;
        let modlogSoftban = message.guild.channels.find('name', 'mod-log');
        let userSoftban = message.mentions.users.first();
        if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
            return message.reply(':lock: You need to have `BAN_MEMBERS` Permission to execute `SoftBan`');
        }
        if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) {
            return message.reply(':lock: I need to have `BAN_MEMBERS` Permission to execute `SoftBan`');
        }
        if (!modlogSoftban) {
            return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
        }
        if (message.author.id === userSoftban.id) {
            return message.reply('You cant punish yourself :wink:');
        }
        if (message.mentions.users.size < 1) {
            return message.reply('You need to mention someone to SoftBan him!');
        }
        if (!reasonSoftban) {
            return message.reply(`You must give me a reason for the ban **Usage:**\`~softban [@mention] [example]\``);
        }
        userSoftban.send(`You've just got softbanned from ${guildSoftban.name}  \n State reason: **${reasonSoftban}** \n **Disclamer**: In a softban you can come back straight away, we just got your messages deleted`);
        message.guild.ban(userSoftban, 2);
        setTimeout(() => {
            message.guild.unban(userSoftban.id);
        }, 0);

        modlogSoftban.send({embed: {
            color: 0x18FE26,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            fields: [{
                name: "Softban:",
                value: `**Softbanned:** ${userSoftban.username}#${userSoftban.discriminator}\n**Moderator:** ${message.author.username}\n**Reason:** ${reasonSoftban}`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: settings.footerText
            }
          }
        });
        break;

        case "todo":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}todo command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}todo command!`);

        if (message.author.id == settings.ownerID) {
            return message.channel.send(`**Unban command.**\n
**Bot's owner commands.**\n
**Some fun commands.**\n
~~Mute command~~\n
~~Unmute command~~\n
~~Server info~~\n
~~Softban command\n~~
**~~watch porn man~~**`);
        } else {
            message.react('❌');
            message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
        }
        break;

        case "botname":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}botname command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}botname command!`);

        const botusername = message.content.split(' ').slice(1).join(' ');

        if (message.author.id == settings.ownerID) {
            client.user.setUsername(botusername);
            message.reply('Done. :ok_hand:');
        } else {
            message.react('❌');
            message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
        }
        break;

        case "botavatar":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}botavatar command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}botavatar command!`);

        const botavatar = message.content.split(' ').slice(1).join(' ');
        var request = require("request").defaults({ "encoding" : null });

        if (message.author.id == settings.ownerID) {
request(botavatar, function (err, res, body) {
    if (!err && res.statusCode === 200) {
        var data = "data:" + res.headers["content-type"] + ";base64," + new Buffer(body).toString("base64");
        client.user.setAvatar(botavatar).catch((error) => { message.channel.send('Beep boop, something went wrong. Check the console to see the error.'); console.log('Error on setavatar command:', error); });

        message.channel.send('Done. :ok_hand:');
    }
});
        } else {
            message.react('❌');
            message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
        }
        break;

        case "botnick":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}botnick command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}botnick command!`);

        const botnickname = message.content.split(' ').slice(1).join(' ');

        if (message.author.id == settings.ownerID){
            message.guild.members.get(client.user.id).setNickname(botnickname);
            message.channel.send('Done. :ok_hand:');
        } else {
            message.react('❌');
            message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
        }
        break;

        case "eval":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}eval command!`);

        const clean = text => {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          }

            const evalargs = message.content.split(" ").slice(1);

              if (message.author.id == settings.ownerID) {
              try {
                const code = evalargs.join(" ");
                let evaled = eval(code);

                if (typeof evaled !== "string")
                  evaled = require("util").inspect(evaled);

                message.channel.send(clean(evaled), {code:"xl"});
              } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
              }
            } else {
                message.react('❌');
                message.channel.send(`\`📛\` You don't have permissions to execute that command.`);
            };
        break;

        case "roll":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}roll command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}roll command!`);

        let rollnumber = message.content.split(' ').slice(1).join(' ');

        if (!rollnumber) {
            return message.reply(`:game_die: Just rolled a number: **${Math.floor(Math.random() * 100) + 1}**`);
        }

        message.reply(`:game_die: Just rolled a number: **${Math.floor(Math.random() * rollnumber) + 1}**`);
        break;

        case "stats":
        console.log(`${message.author.tag} used the ${settings.botPREFIX}stats command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}stats command!`);

        let { version } = require("discord.js");
        let statsmoment = require("moment");
        require("moment-duration-format");
        let duration = statsmoment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

message.channel.send({embed: {
    color: 3447003,
    author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
    },
    title: "Stats:",
    fields: [
      { name: ":fire: Memory", value: `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`, inline: true},
      { name: ":clock1030:  Uptime", value: `**${duration}**`, inline: true},
      { name: ":speech_balloon: Servers", value: `**${client.guilds.size.toLocaleString()}**`, inline: true},
      { name: ":runner: Users", value: `**${client.users.size.toLocaleString()}**`, inline: true},
      { name: ":incoming_envelope: Discord.js", value: `**v${version}**`, inline: true},
      { name: ":white_check_mark: Node.js", value: `**${process.version}**`, inline: true}
    ],
    timestamp: new Date(),
    footer: {
        icon_url: client.user.avatarURL,
        text: settings.footerText
    }
  }
});
        break;

        case "clear":
            console.log(`${message.author.tag} used the ${settings.botPREFIX}clear command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}clear command!`);

            if (!message.guild.member(message.author).hasPermission('MANAGE_MESSAGES')) return message.reply(':lock: **You** need `MANAGE_MESSAGES` permissions to execute `clear`');
            if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.reply(':lock: **I** need `MANAGE_MESSAGES` Permissions to execute `clear`');
            const firstUserClear = message.mentions.users.first();
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Must specify an amount to delete!');
            if (!amount && !firstUserClear) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
            message.channel.fetchMessages({
                limit: amount,
            }).then((messages) => {
                if (firstUserClear) {
                    const filterBy = firstUserClear ? firstUserClear.id : client.user.id;
                    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                }
                message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            });
            break;

            case "botstatus":
            console.log(`${message.author.tag} used the ${settings.botPREFIX}botstatus command!`);
            logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}botstatus command!`);

            let setStatusArgs = message.content.split(' ').slice(1).join(' ');
            
            if (!message.author.id == settings.ownerID) return message.channel.send(`\`📛\` You're not allowed to execute this command!`);
            if (!setStatusArgs) return message.channel.send(`**Missing argument.**\nExample: **${settings.botPREFIX}setstatus [online, idle, dnd, invisible]**`);
            if (!setStatusArgs == "online" || "idle" || "dnd" || "invisible") return message.channel.send(`**Wrong argument.**\nExample: **${settings.botPREFIX}setstatus [online, idle, dnd, invisible]**`);

            client.user.setStatus(setStatusArgs)
            .then(message.channel.send('Done. :ok_hand:'));
            break;
        
        case "help":
        logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}help command!`);
        try {
            message.react('✅');
            message.channel.send({embed: {
            color: 3447003,
            fields: [{
                name: "Regular commands",
                value: `**${settings.botPREFIX}help** - This message!\n\
**${settings.botPREFIX}modhelp** - Commands for admins and mods\n\
**${settings.botPREFIX}ownerhelp** - Owner's commands\n\
**${settings.botPREFIX}ping** - How much ms?\n\
**${settings.botPREFIX}userinfo** - Mention user for info\n\
**${settings.botPREFIX}avatar** - Get user's avatar\n\
**${settings.botPREFIX}stats** - Bot's stats\n\
**${settings.botPREFIX}serverinfo** - See server stats\n\
**${settings.botPREFIX}quote** - Quotes by people\n\
**${settings.botPREFIX}notice** - I'll hug you\n\
**${settings.botPREFIX}roll** - Rolls a random number!`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: settings.footerText
            }
          }
        });
        }
        catch(err) {
            message.channel.send('I could not send you my commands!');
        } 
        break;

    case "modhelp":
    logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}modhelp command!`);
    message.react('✅');
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Bot's commands",
        fields: [{
            name: "Moderation commands",
            value: `**${settings.botPREFIX}ban** - Bans a user from your server! (Moderators only!)\n\
**${settings.botPREFIX}kick** - Kicks a user out of the server! (Mederation only!)\n\
**${settings.botPREFIX}mute** - Muted a user with a **muted** role! (Moderation only!)\n\
**${settings.botPREFIX}unmute** - Unmutes a user and removes the **muted** role. (Moderation only!)\n\
**${settings.botPREFIX}softban** - Kicks a user and deletes his messages. (Moderation only!)\n\
**${settings.botPREFIX}clear** - Clear messages / user's messages! (Moderation only!)`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: settings.footerText
        }
      }
    });
    break;

    case "ownerhelp":
    logsCommands.send(`${message.author.tag} used the ${settings.botPREFIX}ownerhelp command!`);

    if (message.author.id == settings.ownerID) {
        message.react('✅');
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Bot's commands",
            fields: [{
                name: "Bot's owner commands",
                value: `**${settings.botPREFIX}botname** - Changes the bot's username. **Usage: ${settings.botPREFIX}botname [NAME]**\n\
**${settings.botPREFIX}botavatar** - Changes the bot's avatar. **Usage: ${settings.botPREFIX}botavatar [LINK]**\n\
**${settings.botPREFIX}botnick** - Changed the nickname in a server. **Usage: ${settings.botPREFIX}botnick [NICKNAME]**\n\
**${settings.botPREFIX}eval** - Evaluates a code. **Usage: ${settings.botPREFIX}eval [CODE]**\n\
**${settings.botPREFIX}shutdown** - Closes the CMD window!\n\
**${settings.botPREFIX}botstatus** - Change the bot's status! **Usage: ${settings.botPREFIX}botstats [STATUS]**`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: settings.footerText
            }
          }
        });
    } else {
        message.react('❌');
        message.channel.send(`\`📛\` Only Bot Owner can use this Command.`);
    }
    break;
    }
});

client.login(settings.botTOKEN)





