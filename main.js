import fs from 'fs';
import path from 'path';
import input from '@inquirer/input';
import confirm from '@inquirer/confirm';
import { ExitPromptError } from '@inquirer/core';

process.on('SIGINT', () => {
    console.log('Bye!');
    process.exit(0);
});

(async () => {
    try {
        const folderPath = await input({
            message: `Enter directory of files, or leave empty for current directory`,
            default: './',
            validate: input => {
                const invalidChars = /[*?"<>|]/;
                if (invalidChars.test(input)) {
                    return 'Invalid characters in folder path';
                }
                try {
                    const stats = fs.statSync(input);
                    if (!stats.isDirectory()) {
                        return "Path exists but is not a directory";
                    }
                } catch {
                    return "Directory doesn't exist"
                }

                return true;
            }
        })

        const fileExt = await input({
            message: `Enter extension of files that need to be renamed, or leave empty for .txt:`,
            default: '.txt',
            validate: input =>
                input.includes('/') || input.includes('\\')
                    ? 'Invalid characters in file extension'
                    : true,
        });

        const files = fs.readdirSync(folderPath).filter(file => file.endsWith(`${fileExt}`));

        if (files.length === 0 || fileExt.trim() === '') {
            console.log(`No ${fileExt} files found.`);
            return;
        }

        for (const file of files) {
            const newName = await input({
                message: `Enter new name for "${file}" (without extension), or leave empty to skip:`,
                validate: input =>
                    input.includes('/') || input.includes('\\')
                        ? 'Invalid characters in file name'
                        : true,
            });

            const oldPath = path.join(folderPath, file);
            const newPath = path.join(folderPath, `${newName}${fileExt}`);

            if (fs.existsSync(newPath)) {
                const shouldOverwrite = await confirm({
                    message: `File "${newName}${fileExt}" already exists. Overwrite?`,
                    default: false,
                });

                if (!shouldOverwrite) {
                    console.log(`Skipped: ${newName}${fileExt} (file exists)`);
                    continue;
                }
            }
            if (newName.trim() == ''){
                console.log(`Skipped: ${file}${fileExt}`);
                continue;
            }
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`Renamed to: ${newName}${fileExt}`);
            } catch (err) {
                console.error(`Failed to rename "${file}":`, err.message);
            }
        }
        console.log('Done.');
    } catch(err) {
        if (err instanceof ExitPromptError) {
            console.log("Bye!");
            process.exit(0);
        } else {
            console.log('Unexpected error:', err);
            process.exit(1);
        }
    }
})();