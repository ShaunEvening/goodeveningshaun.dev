---
title: "Green web tips: optimizing your fonts"
description: How to use beautiful custom fonts without the bloat.
author: "shaun-evening"
pubDate: Mar 11 2024
heroImage:
  src: "blog-header"
  alt: ""
isDraft: false
---

Using custom fonts is a great way to make your website pop. However, it’s also one of the fastest ways to add some serious weight to your page. Once you factor in each font file for different weights and italics, fonts can easy contribute over 1Mb of data needing to be downloaded when visiting your page. If the average page weight is 2.5Mb, that accounts for **at least 40%** of the bundle!

When it comes to sustainable development, this is a red flag! Does this mean that you need to ditch your favourite custom fonts to build a greener web? Not at all, my carbon-conscious friends! There’s a few ways to slim down those files so that you can use those dazzling fonts without the dizzying file sizes.

This week I decided to add `Inter`, by Rasmus Andersson, to my website. In fact, you’re seeing it now— what do you think? In this article, I’ll walk you through the steps that I took to go from 1,757Kb (1.7Mb) of font files down to 143Kb!

## Variable fonts

Typically, when you’re looking to use a font, you’ll get multiple files for different style variations of a font. For example, `Inter` ships with **36 different files** to give you every font weight from thin - black in normal and italics. Each of these files is ~100kb in size which means a user would need to download **~3.6Mb** of fonts alone just to read this article.

This is where variable fonts come in. Instead of having 36 individual files, a variable font is designed to store multiple styles and weights in one file at a fraction of the size. In my case, `InterVariable` is just two files, normal and italic, which are ~1.7Mb combined. That’s already a **52.7% reduction** in size!

## Font file formats

Next, let’s talk about file formats. There are a few different formats available, but when it comes to the web, we should always convert our font files to Web Open Font Format, **WOFF**, or Web Open Font Format V2, **WOFF2** files. These two formats are specifically optimized for the web and widely supported in browsers.

For example, `InterVariable.ttf` is 863Kb while `InterVariable.woff2` is only 346Kb. That’s a 59.9% reduction in file size.

## subsetting your fonts

By adding `InterVariable.woff2` and `InterVariable-Italic.woff2` to the page, that adds 727Kb to the overall weight. While this is way better than the ~3.6Mb of WOFF2 files we’d need for the non-variable version of the font, we can do better with font subsetting.

Font subsetting is the process of removing unused glyphs (characters) from the font file so that you only have exactly what you need and nothing more. For example, if I never use a capital “q”, it would be striped out of the font file. There are a few free online tools out there to subset your fonts, like [FontSqurriel](https://www.fontsquirrel.com/tools/webfont-generator) but this requires you to upload a font, subset it, download it, and add it to your project.

Instead i’m going to use a tool called [`glyphhanger`](https://github.com/zachleat/glyphhanger) to do it locally. `glyphhanger` can analyze my built down html files to see what glyphs i’m using then create a subset WOFF2 file from a `.ttf` file with only the glyphs that I need.

### Setup

To get started let’s install `glyphhanger` into our project by running the following:

```bash
# For NPM users
npm i -D glyphhanger

# For Yarn users
yarn add -D glyphhanger

# For PNPM users
pnpm add -D glyphhanger
```

`glyphhanger` is a JavaScript wrapper for a set of python tools we’ll need to install. So run the following to get them installed:

```bash
# Installs the main tools
pip3 install fonttools

# Additional installation for woff2 support
pip3 install brotli
```

Now check that you have `fonttools` installed by running:

```bash
which fonttools # Should return the path to the install
```

If you don’t have it, you may need to add it to your `$PATH` in your `.zshrc` file like I had to. (Don’t forget to run `source ~/.zshrc` after you update `.zshrc` file.)

### Adding a build script

To make `glyphhanger` easier to run, I made a quick script that I don’t run through pnpm (or npm or yarn). This will tell `glyphhanger` which html files to check, what font files to subset, and where to put the result.

For this script I used a package called `fast-glob` to get the path of each html file programmatically. You’ll need to install it in your project for this script to work. Run the following:

```bash
# For NPM users
npm i -D fast-glob

# For Yarn users
yarn add -D fast-glob

# For PNPM users
pnpm add -D fast-glob
```

The code for my subsetting script looks like this:

```jsx
// ./scripts/subset-fonts.js

import { execSync } from "child_process";
import fastGlob from "fast-glob";

// File all html files inside of the dist folder
const pages = fastGlob.sync("./dist/**/*.html");

// Pattern for the original font files. Mine are in './fonts'
const fontFiles = "./fonts/*.ttf";

// Glyphs that should be included in the font regardless of usage
const glyphAllowList = ["↗"];

// Where I want my subset files to live
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
```

Last of all, I’ll add a script to my `package.json` to run this script for me.

```jsx
// Package.json
{
"scripts": {
    // Snipped for clarity
    "subset-fonts": "pnpm build && node ./scripts/subset-fonts.js"
  },
}
```

After running this script, my resulting subset files were a combined 143Kb! This original `.tff` files were 1,757Kb which is a whopping **91.8% reduction**— that’s amazing!

### Including the font faces

All that’s left to do now is create a css file to include the font faces and add import it in our pages.

```css
/* ./public/inter.css */

@font-face {
  font-family: InterVariable;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("/fonts/InterVariable-subset.woff2") format("woff2");
}
@font-face {
  font-family: InterVariable;
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
  src: url("/fonts/InterVariable-Italic-subset.woff2") format("woff2");
}
```

```html
<link rel="stylesheet" href="/fonts/inter.css" />
```

## Let’s build a greener web together

The web currently produces a significant amount of carbon emissions, but it doesn’t have to remain that way. Font subsetting is a great way for us to reduce your website’s impact on the environment.

If this is something that’s interesting to you, let’s stay in touch! The more people we have designing and building a greener web, the larger our impact.

I will be publishing more green web tips over the coming weeks so stay tuned for more. Let me know what you think via [BlueSky](https://bsky.app/profile/goodeveningshaun.dev), [Threads](https://www.threads.net/@shaunevening), or connect with me on [LinkedIn](https://www.linkedin.com/in/shaunevening/).
