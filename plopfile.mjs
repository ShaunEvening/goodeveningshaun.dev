import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";

const MONTH_TO_STRING = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  plop.setActionType("create-folder", (answers, config, plop) => {
    const plopPath = plop.getPlopfilePath();
    const folderPath = resolve(
      plopPath,
      plop.renderString(config.path, answers)
    );

    return mkdir(folderPath).then(
      () => `Image folder created at ${folderPath}`
    );
  });

  plop.setHelper("todays-date", () => {
    const today = new Date();

    return `${
      MONTH_TO_STRING[today.getMonth()]
    } ${today.getDate()} ${today.getFullYear()}`;
  });

  plop.setGenerator("blog", {
    description: "Create a new blog post",
    prompts: [
      {
        type: "input",
        name: "slug",
        message: "Blog slug?",
      },
      {
        type: "input",
        name: "title",
        message: "Blog title?",
      },
      {
        type: "input",
        name: "description",
        message: "Blog description?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/content/blog/{{slug}}.mdx",
        templateFile: "templates/blog.mdx.hbs",
      },
      {
        type: "create-folder",
        path: "src/assets/images/blogs/{{slug}}",
      },
    ],
  });
}
