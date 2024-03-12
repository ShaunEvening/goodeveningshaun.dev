import { execSync } from "child_process";
import fastGlob from "fast-glob";

// File all html files inside of the dist folder
const pages = fastGlob.sync("./dist/**/*.html");

// Pattern for the original font files
const fontFiles = "./fonts/*.ttf";

// Glyphs that should be included in the font regardless of usage
const glyphAllowList = ["↗"];

const outputPath = "./public/fonts";

console.log("Analyzing the following files: \n\t- " + pages.join("\n\t- "));

// Run glyphhanger to subset the fonts
execSync(
  `glyphhanger ${pages.join(
    " "
  )} --subset='./fonts/*.ttf' --formats='woff2' --whitelist='${glyphAllowList.join(
    ""
  )}' --output='${outputPath}'`
);

console.log("Fonts have been subsetted and saved to " + outputPath);
