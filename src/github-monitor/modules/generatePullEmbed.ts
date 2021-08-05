import { DiscordEmbedInt } from "../../interfaces/DiscordEmbedInt";
import { GlobalConfigInt } from "../../interfaces/GlobalConfigInt";
import { customSubstring } from "../../utils/customSubstring";
import { errorHandler } from "../../utils/errorHandler";
import { GithubPullInt } from "../interfaces/GithubPullInt";

export const generatePullEmbed = (
  CONFIG: GlobalConfigInt,
  data: GithubPullInt
): DiscordEmbedInt | null => {
  try {
    if (!["opened", "edited", "closed"].includes(data.action)) {
      return null;
    }
    const embed: DiscordEmbedInt = {
      title: "New Pull Request Activity!",
      url: data.pull_request.html_url,
      color: 0x8b4283,
      description: `A pull request was ${data.action}`,
      author: {
        name: data.sender.login,
        icon_url: data.sender.avatar_url,
      },
      fields: [
        {
          name: "Repository",
          value: data.repository.name,
        },
        {
          name: "Title",
          value: data.pull_request.title,
        },
        {
          name: "Description",
          value: customSubstring(data.pull_request.body, 1000),
        },
      ],
      footer: {
        text: `Pull Request number ${data.pull_request.number}`,
      },
    };

    if (data.pull_request.merged) {
      embed.description = `A pull request was merged!`;
    }
    return embed;
  } catch (err) {
    errorHandler(CONFIG, "pull embed generator", err);
    return null;
  }
};
