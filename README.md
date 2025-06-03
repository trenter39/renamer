# 📁 Renamer CLI

a simple Node.js CLI tool that allows you to bulk rename files in a folder based on their extension.
you can specify the directory and file extension, and the program will walk through each file and ask you to provide a new name or skip it.

✨ features:
1. choose any directory (or use the current one).
2. select which file extension to work with (default: .txt).
3. rename files interactively one by one.
4. prevents overwriting by prompting if a name already exists.
5. handles invalid characters in file names.

📦 installation:

clone the repository and install dependencies:
```
git clone https://github.com/trenter39/renamer.git
cd renamer
npm install
```
🎯 usage:

```
npm start
```
