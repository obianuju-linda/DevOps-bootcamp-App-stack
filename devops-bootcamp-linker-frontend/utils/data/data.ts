import {
  FaDev,
  FaFacebook,
  FaFreeCodeCamp,
  FaGitlab,
  FaHashnode,
  FaLinkedin,
  FaStackOverflow,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiCodewars } from "react-icons/si";
import { TbBrandGithubFilled } from "react-icons/tb";

export const socialsObject = {
  GitHub: {
    id: 1,
    icon: TbBrandGithubFilled,
    platform: "GitHub",
    color: "#1A1A1A",
  },
  LinkedIn: { id: 2, icon: FaLinkedin, platform: "LinkedIn", color: "#2D68FF" },
  YouTube: { id: 3, icon: FaYoutube, platform: "YouTube", color: "#EE3939" },
  Twitter: { id: 4, icon: FaTwitter, platform: "Twitter", color: "#43B7E9" },
  Twitch: { id: 5, icon: FaTwitch, platform: "Twitch", color: "#EE3FC8" },
  "Dev.to": { id: 6, icon: FaDev, platform: "Dev.to", color: "#333333" },
  Codewars: { id: 7, icon: SiCodewars, platform: "Codewars", color: "#8A1A50" },
  FreeCodeCamp: {
    id: 8,
    icon: FaFreeCodeCamp,
    platform: "FreeCodeCamp",
    color: "#302267",
  },
  GitLab: { id: 9, icon: FaGitlab, platform: "GitLab", color: "#EB4925" },
  Hashnode: {
    id: 10,
    icon: FaHashnode,
    platform: "Hashnode",
    color: "#0330D1",
  },
  "Stack Overflow": {
    id: 11,
    icon: FaStackOverflow,
    platform: "Stack Overflow",
    color: "#EC7100",
  },
  Facebook: {
    id: 12,
    icon: FaFacebook,
    platform: "Facebook",
    color: "#EC7100",
  },
};
