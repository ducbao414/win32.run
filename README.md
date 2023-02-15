# Introduction


https://user-images.githubusercontent.com/5462728/218907749-22ddea15-8761-4cf3-b162-e2817c0f9db8.mp4


Yet another Windows XP in the browser, but with a File System and comes with it, Programs.

*Microsoft and Windows XP trademarks & logos definitely belong to Microsoft Corporation. All the programs' names and logos (Foxit, Word, WinRar, Internet Explorer, etc.) are of their rightful copyright holders. **win32.run** is purely for the purpose of nostalgia. I have no intent and no right to monetize  **win32.run**, but you may occasionally see ads when playing third-party games.*

win32.run runs solely on the client-side (the user's browser). All files are processed right in the user's browser. There is no file uploading, no server-side processing (cause I'm broke, can't afford it). Each user has his own OS session (just like the good old Windows XP)

Files (and Folders) in win32.run are stored locally in IndexedDB. Apps (and 3rd-party apps) can interact with files through win32.run homemade file picker and saver dialog (with Windows XP appearance).
# Run, build & deploy
I deploy it on a $5 Vultr instance, so there's no special hardware and dependencies requirement here, except Node.js (and NPM).

The project is built with [Svelte](https://github.com/sveltejs/svelte), which may not be great at backward-compatibity at its current phase.  You probably don't want to update Svelte and SvelteKit to newer versions to keep things working.
## Install dependencies
Clone or download from Github
```shell
git clone git@github.com:ducbao414/win32.run.git
cd win32.run
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
The build output location is win32.run/build
To preview the build
```shell
npm run preview
```
## Deploy
I shamelessly share my deployment process.

Follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04) to set up a Ubuntu server with NGINX. I chose Vultr cause theirs is cheaper than DigitalOcean ($5 vs $6).

Put the build folder, package.json, package-lock.json on to the server, ```cd``` then ```npm install```

Finally, ```pm2 start build/index.js``` to start win32 at localhost:3000
# Documentation
Please visit [win32 Docs](https://docs.win32.run)
