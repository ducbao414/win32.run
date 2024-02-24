### Windows XP in the browser, with a File System, programs, XP-style File Picker and Saver dialogs, 3rd-party program, etc.
## [🍭 win32.run](https://win32.run)

![License MIT](https://badgen.net/badge/license/MIT/green)
[![css tailwind](https://badgen.net/badge/css/tailwind/blue)](https://github.com/tailwindlabs/tailwindcss)
[![js framework svelte](https://badgen.net/badge/built/svelte/orange)](https://github.com/sveltejs/svelte)

#
https://user-images.githubusercontent.com/5462728/218907749-22ddea15-8761-4cf3-b162-e2817c0f9db8.mp4
#
*Microsoft and Windows XP trademarks & logos definitely belong to Microsoft Corporation. All the programs' names and logos (Foxit, Word, WinRar, Internet Explorer, etc.) are of their rightful copyright holders. **win32.run** is purely for the **purpose of nostalgia**. I have no intent and no right to monetize  **win32.run**, but you may occasionally see ads when playing third-party games.*

# Introduction
## 🦄 It's for nostalgia's sake!

**WIN32.RUN** runs solely on the client-side (the user's browser). All files are processed right in the user's browser. There is no file uploading, no server-side processing (cause I'm broke, can't afford it). Each user has his own OS session (just like the good old Windows XP)

Files (and Folders) in win32.run are stored locally in IndexedDB. Apps (and 3rd-party apps) can interact with files through win32.run homemade file picker and saver dialog (with Windows XP appearance).
## Built with
WIN32.RUN is built with [Svelte](https://github.com/sveltejs/svelte)/[SvelteKit](https://github.com/sveltejs/kit) and [Tailwindcss](https://github.com/tailwindlabs/tailwindcss).
If you come from a React or Vue background, Svelte is really easy to work with. It doesn't have much boilerplate. 

Writing webapps in Svelte is just like writing vanilla JS, with ```div``` tag for UI and ```script``` tag for logic. One can pick it up in under an hour.

The downside is *surprised breaking changes*.

# Run, build & deploy
I deploy it on a $5 Vultr instance, there's no special hardware and dependencies requirement here, except Node.js (and NPM).

The project is built with [Svelte](https://github.com/sveltejs/svelte), which may not be great at backward-compatibity at its current phase.  You probably don't want to update Svelte and SvelteKit to newer versions to keep things working.
## 📦 Install dependencies
Clone or download from Github
```shell
git clone https://github.com/ducbao414/win32.run.git
cd win32.run-main
```
Then install dependencies
```shell
npm install
```
## Run
```shell
npm run dev
```
The dev server is at http://localhost:3000
## Build
```shell
npm run build
```
The build output location is win32.run-main/build
To preview the build
```shell
npm run preview
```
## Deploy
I shamelessly share my deployment process.

Follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04) to set up a Ubuntu server with NGINX. I chose Vultr since theirs is cheaper than DigitalOcean's ($5 vs $6).

Put the build folder, package.json, package-lock.json on to the server, ```cd``` then ```npm install```

Finally, ```pm2 start build/index.js``` to start win32 at localhost:3000
# Documentation
If you're interested in expanding or customizing win32.run, please have a look at its documentation.

[![Please visit docs.win32.run](https://img.shields.io/badge/view-Documentation-blue?style=for-the-badge)](https://docs.win32.run)

### This project has been discontinued. 
Even though I don't enjoy React syntax and its methodology, NextJS by Vercel offers a better developer experience than SvelteKit in every way imaginable: it has better backward compatibility, improved tooling, comprehensive documentation, stabability, seamless functionality (everything just worked as expected), rich 3rd-party libraries, less memory consumption, etc.

While it has been an enjoyable experience working on win32.run, the numerous breaking changes in SvelteKit have rendered its codebase incomprehensible to other developers. It will take a complete restructure to make it work with new SvelteKit releases. 
I don't see this project contributing in any meaningful way to either developers utilizing Svelte or those in the process of learning Svelte.
