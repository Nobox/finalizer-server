# Finalizer Server
Server to manage and build npm dependencies. This build server will be in charge of installing npm dependencies, storing and packaging them in a compressed `.tar` file.

## How it works?
Once installed it will store your npm dependencies on a per-project basis. It uses a Redis database to store all of your projects and builds information. It will store up to 5 builds on an unlimited amount of projects. You will use the CLI tool to do these tasks:

- Create projects.
- Create builds.
- Download latest build of a project.

## Why do you need this?
- It will help avoid npm installation issues when deploying your project.
- Make deployments and instalation of dependencies faster.
- No need to have a 4GB+ server for simple static sites.

## Installation
Clone the repository
```bash
git clone git@github.com:Nobox/finalizer-server.git && cd finalizer-server
```

Install dependencies
```bash
npm install
```

Start the server
```bash
npm start
```

Now this build server should be ready to receive requests from the CLI client.

## To-do's
- Make a nice web based UI with the listing of all the projects and builds.
- Manage builds (run, delete) from here.
- Better test coverage on both the server and the CLI.

## License
MIT
