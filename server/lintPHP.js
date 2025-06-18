import { writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';

export async function lintPHPCode(code) {
    const filename = 'temp-lint.php';

    try {
        await writeFile(filename, code);

        return new Promise((resolve, reject) => {
            exec(`php -l ${filename}`, async (err, stdout, stderr) => {
                await unlink(filename);

                if (err || stdout.includes("Parse error")) {
                    reject(stdout || stderr);
                } else {
                    resolve(true);
                }
            });
        });
    } catch (err) {
        throw new Error("Linting failed: " + err.message);
    }
}
