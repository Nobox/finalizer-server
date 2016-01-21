# Finalizer Server
This build server will be in charge of installing npm dependencies, packaging them in a compressed `.tar` and uploading them to the project server.

## Server build structure
Build structure example with various projects and builds for each project.
```
├── project-1/
│   ├── build-1/
│   │   ├── node_modules/
│   │   ├── node_modules.tar
│   │   ├── package.json
|   ├── build-2/
│   │   ├── node_modules/
│   │   ├── node_modules.tar
│   │   ├── package.json
├── project-2/
│   ├── build-1/
│   │   ├── node_modules/
│   │   ├── node_modules.tar
│   │   ├── package.json
```

## Steps to be done for each build
Each time a build is created, these are the steps executed by the server.
- *Clone the project with `git`
- Extract `package.json`
- Run `npm install`
- Compress and make the `.tar` file from the `node_modules` folder.
- Remove the `node_modules` folder.
- Dispatch a signal to the client that the build is ready.

** For now, we won't be using `git` to clone the project, we just might send a `POST` request from the client with the contents of the `package.json`?

## Server notes
- Server will list an unlimited number of projects.
- Server will manage and build up to 5 builds per project.
- The oldest build will be replaced with the most recent one.
- We will use a queue to manage the workload of builds. For now the server will handle one build at a time.

## Nice to have's
- Make a nice web based UI with the listing of all the projects and builds.
- Manage builds (run, delete) from here.

# Finalizer CLI Client
The client will be installed on each project and it's sole purpose is to request the latest build from the server and rebuild the dependencies. Steps executed by the client:
- Link the project to the build server.
- Request the latest build from the server. If the build doesn't exists, show a warning.
- Extract the compressed `.tar`.
- Run `npm rebuild` to relink all the dependencies.

## Link (or create) project to the build server
Command to link the current project to the build server. This should be done only one. Command parameters and options to be decided.
```bash
finalize create project-name
```
Once the project is created on the build server, it will create the first build automatically.

## Build project
The project must exist already on the build server. Command parameters and options to be decided.
```bash
finalize build
```
If the `package.json` has not changed since the last build, that last build will be used instead. This will prevent the creation of innecesary builds on the server.

