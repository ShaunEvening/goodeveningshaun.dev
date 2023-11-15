---
title: Zero-config support for Tailwind, MUI, styled-components, and Emotion
description: New zero-config support for JavaScript's most popular styling libraries
author: 'shaun-evening'
pubDate: 'Jun 22 2023'
heroImage:
  src: '/addon-styling-hero-codemods.gif'
  alt: ''
canonicalUrl: 'https://storybook.js.org/blog/zero-config-support-for-tailwind-mui-styled-components-and-emotion/'
---

Setting up Storybook with your favorite styling tools can feel like assembling IKEA furniture. The instructions say things should fit together, but sometimes you need a stroke of genius to figure out how.

Today, I'm excited to share that Storybook’s official styling-addon now features zero-config support for JavaScript’s most popular styling libraries, including:

- 💨 Tailwind
- 🧶 MaterialUI
- 💅 Styled Components
- 👩‍🎤 Emotion

Read on to learn context, usage guidance, and our plans for the future.

![One of the auto-config codemods in action, setting up Storybook for Tailwind](https://storybookblog.ghost.io/content/images/2023/06/2023-06-06-13.41.34--1-.gif)

## Wait, but why?
The world's leading frontend teams use Storybook to develop, test, and document UI. Scroll through our Component Encyclopedia to see examples of UI that are literally out of this world. Looking at you, NASA.

However, the challenge of integrating tooling into Storybook can be a barrier to new users getting started. Some devs don't progress beyond the setup stage at all.

Over the past year, we wrote recipes and tutorials for connecting Storybook with tools like Tailwind, MUI, Styled Components, and Vuetify. We also shipped the official Styling Addon, which features quick-start configuration templates and and theme support.

Still, these solutions require some set-up from you. That's about to change.

## Introducing auto-config codemods
Our new codemods ramp up this process by automatically configuring Storybook for your project's styling library. They identify styling tools, set up configuration, and enable you to start writing stories faster.

Use the codemods in your project:

1. Make sure that you're using Storybook 7 and @storybook/addon-styling (a version newer than 1.1.0)
2. Within the root of your project, run node node_modules/@storybook/addon-styling/bin/postinstall.js.
3. Storybook will configure itself to work with your tooling
4. ✅ You can confirm the results

![Logos for styling tools: Tailwind, MUI, Emotion, and Styled Components](https://storybookblog.ghost.io/content/images/size/w1600/2023/06/styling-tools.png)

## What's next?
Currently, styling codemods need to be run manually. In the future, our goal is for Storybook to automatically recognize your styling tools and configure everything without you lifting a finger. We're excited to share more in the months ahead. Join our Discord server #contributing to join our team.

If you have trouble running these codemods in your project, give feedback at GitHub Issues.