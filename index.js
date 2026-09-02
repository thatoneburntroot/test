require("dotenv").config();

const { App } = require("@slack/bolt");
const { defaultAsyncDispatchErrorHandler } = require("@slack/bolt/dist/receivers/HTTPModuleFunctions");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const translations = {
  "let's circle back on this":
    "I don't want to deal with this right now.",

  "let's take this offline":
    "Stop talking about this in front of everyone.",

  "i'll keep you in the loop":
    "I probably won't tell you anything.",

  "just touching base":
    "I need something from you.",

  "as per my last email":
    "I already told you this. Please read.",

  "moving forward":
    "We're pretending the previous disaster didn't happen.",

  "we need to be more proactive":
    "Someone screwed up and we're blaming everyone.",

  "let's leverage our synergies":
    "I have no idea what I'm talking about.",

  "there are some exciting challenges ahead":
    "Things are about to get horrible.",

  "we're pivoting":
    "The original idea failed.",

  "we value your feedback":
    "We'll listen and then do nothing.",

  "this is a great opportunity for growth":
    "You're getting more work.",

  "we're working on improving efficiency":
    "We're cutting costs.",

  "we're restructuring":
    "Someone is getting fired.",

  "we need everyone to pull together":
    "We're understaffed.",

  "can you jump on a quick call":
    "There goes your afternoon.",

  "do you have a minute":
    "This will take at least 30 minutes.",

  "let's put a pin in this":
    "We're never discussing this again.",

  "i'll get back to you":
    "I'm hoping you forget about this.",

  "interesting":
    "I hate this idea.",

  "that's an interesting perspective":
    "I strongly disagree with you.",

  "we should explore that":
    "We're not doing that.",

  "i'll see what i can do":
    "Probably nothing.",

  "noted":
    "I heard you. I'm ignoring you.",

  "thanks for flagging this":
    "Why the hell didn't you tell me sooner?",

  "let's align on this":
    "You and I currently disagree.",

  "we're all hands on deck":
    "Everyone is working overtime.",

  "this is a priority":
    "Drop everything you're doing.",

  "this is our top priority":
    "Everything else is now also a priority.",

  "we need to manage expectations":
    "We're probably going to disappoint you.",

  "i'll defer to you on this":
    "If this goes wrong, it's your fault.",

  "let's not reinvent the wheel":
    "Do what we did last time.",

  "think outside the box":
    "Come up with an idea I haven't already rejected.",

  "we're a family here":
    "Please accept significantly lower pay.",

  "we work hard and play hard":
    "We work way too much.",

  "there's no such thing as a stupid question":
    "There absolutely is.",

  "we're looking for someone who can wear many hats":
    "One person will be doing five people's jobs.",

  "we're a fast-paced environment":
    "Everything is constantly on fire.",

  "competitive salary":
    "We don't want to tell you the salary.",

  "unlimited pto":
    "You technically can take time off.",

  "we're like a startup":
    "We have no idea what we're doing.",

  "we're experiencing some growing pains":
    "Everything is breaking.",

  "unfortunately, we've decided to go in a different direction":
    "We picked someone else.",

  "your role has evolved":
    "Your job is now completely different.",

  "we need to have a difficult conversation":
    "This conversation is going to ruin your day.",

  "i'd love to hear your thoughts":
    "Please agree with me.",

  "let's revisit this next quarter":
    "Please forget about this.",

  "we appreciate your flexibility":
    "We're changing the plan again.",

  "this should be a quick turnaround":
    "I want this immediately.",

  "can you prioritize this":
    "Do this instead of whatever your actual job is.",

  "we're waiting on a few stakeholders":
    "Someone hasn't replied to my email.",

  "let's make this more actionable":
    "I don't understand what you just said."
};

app.command("/corporate-translator-ping", async ({ ack, respond }) => {
  const start = Date.now();

  await ack();

  const latency = Date.now() - start;

  await respond({
    response_type: "ephemeral",
    text: `🏓 Pong!\n\n⚡ Response latency: ${latency}ms`
  });
});

app.command("/corporate-translator", async ({ command, ack, respond }) => {
  await ack();

  const input = command.text.trim();

  // Nothing entered
  if (!input) {
    await respond({
      response_type: "ephemeral",
      text:
        "🤨 You forgot the corporate bullshit.\n\n" +
        "Try:\n" +
        '`/corporate-translator "Let\'s circle back on this"`\n\n' +
        "Need examples? Try `/corporate-translator-help`."
    });

    return;
  }

  // Normalize the input
  const normalizedInput = input
    .toLowerCase()
    .replace(/[.!?,]/g, "")
    .trim();

  // Look for translation
  const translation = translations[normalizedInput];

  if (translation) {
    await respond({
      response_type: "in_channel",

      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🧑‍💼 *Corporate:* "${input}"`
          }
        },

        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🗣️ *Translation:* ${translation}`
          }
        }
      ]
    });

    return;
  }

  await respond({
    response_type: "ephemeral",
    text:
      `🤔 I don't know how to translate "${input}" yet.\n\n` +
      "Try `/corporate-translator-help` to see supported phrases."
  });
});


app.command("/corporate-translator-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    response_type: "ephemeral",

    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🧑‍💼 Corporate Translator"
        }
      },

      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "Paste corporate nonsense into `/corporate-translator` " +
            "and I'll tell you what they *actually* mean."
        }
      },

      {
        type: "divider"
      },

      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*Try phrases like:*\n\n" +

            "• `Let's circle back on this`\n" +
            "• `Let's take this offline`\n" +
            "• `I'll keep you in the loop`\n" +
            "• `Just touching base`\n" +
            "• `As per my last email`\n" +
            "• `Moving forward`\n" +
            "• `We need to be more proactive`\n" +
            "• `Let's leverage our synergies`\n" +
            "• `We're pivoting`\n" +
            "• `We value your feedback`\n" +
            "• `We're restructuring`\n" +
            "• `Can you jump on a quick call?`\n" +
            "• `Do you have a minute?`\n" +
            "• `Let's put a pin in this`\n" +
            "• `This is a great opportunity for growth`\n" +
            "• `We're a fast-paced environment`\n" +
            "• `Competitive salary`\n" +
            "• `We're like a startup`\n" +
            "• `We need to manage expectations`"
        }
      },

      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            "*Example:*\n\n" +
            '`/corporate-translator "We need to manage expectations"`\n\n' +
            "🗣️ *Translation:* We're probably going to disappoint you."
        }
      },

      {
        type: "divider"    
      },

      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text:
              " Turning corporate BS into English since 2026."
          }
        ]
      }
    ]
  });
});


app.error(async (error) => {
  console.error("Slack Bot Error:", error);
});


(async () => {
  try {
    await app.start();

    console.log(" Corporate Translator is running!");
    console.log(" Socket Mode connected.");
  } catch (error) {
    console.error(" Failed to start bot:", error);
  }
})();

