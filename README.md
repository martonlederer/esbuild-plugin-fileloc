# esbuild-plugin-fileloc

Support **dirname, **filename and additional global variables with esbuild

## Install

```sh
yarn add -D esbuild-plugin-fileloc
```

or

```sh
npm i -D esbuild-plugin-fileloc
```

## Usage

There are 4 global variables available currently:

```ts
console.log(__dirname); // absolute dirname in source
console.log(__filename); // absolute filename in source
console.log(__relativedirname); // relative dirname in source
console.log(__relativefilename); // relative filename in source
```

## Typescript declarations

To add type declarations for the global variables to your project you can just add this line to your ts file:

```ts
/// <reference types="esbuild-plugin-fileloc" />
```
