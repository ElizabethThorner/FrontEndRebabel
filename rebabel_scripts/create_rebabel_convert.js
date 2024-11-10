const fs = require('fs');
const { spawn, execSync } = require('child_process');
const path = require('path');
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

//delete previous build files
const venvPath = path.join(__dirname, '.venv');
const buildPath = path.join(__dirname, 'build');
const distPath = path.join(__dirname, 'dist');
const specPath = path.join(__dirname, 'rebabel_convert.spec');

const deleteIfExists = (path) => {
    if (fs.existsSync(path)) {
        if (fs.lstatSync(path).isDirectory()) {
            fs.rmSync(path, { recursive: true });
            console.log(`Deleted directory: ${path}`);
        } else {
            fs.unlinkSync(path);
            console.log(`Deleted file: ${path}`);
        }
    }
};

deleteIfExists(venvPath);
deleteIfExists(buildPath);
deleteIfExists(distPath);
deleteIfExists(specPath);

if (isWindows) {
    const scriptPath = path.join('.github', 'scripts', 'create_rebabel_convert_executable_windows.ps1');
    const sourcePath = path.join(__dirname, 'dist', 'rebabel_convert.exe');
    const destinationPath = path.join('node_modules', 'electron', 'dist', 'resources', 'rebabel_convert.exe');

    //create executable
    console.log('Executing PowerShell script to create executable...');

    const powershell = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', scriptPath]);

    powershell.stdout.on('data', (data) => {
        console.log(`PowerShell Output: ${data}`);
    });

    powershell.stderr.on('data', (data) => {
        console.error(`PowerShell Error Output: ${data}`);
    });

    powershell.on('close', (code) => {
        if (code !== 0) {
            console.error(`PowerShell script exited with code ${code}`);
            return;
        }
        console.log('PowerShell script executed successfully.');

        // Copy executable to correct location
        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.error(`Error copying rebabel_convert.exe: ${err.message}`);
            } else {
                console.log('rebabel_convert.exe copied successfully');
            }
        });
    });
}
else {
    const scriptPath = path.join('.github', 'scripts', 'create_rebabel_convert_executable');
    const sourcePath = path.join(__dirname, 'dist', 'rebabel_convert');
    const linuxDestination = path.join('node_modules', 'electron', 'dist', 'resources', 'rebabel_convert');
    const macDestination = path.join('node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'Resources', 'rebabel_convert');
    const destinationPath = isMac ? macDestination : linuxDestination;

    //create executable
    console.log('Executing Bash script to create executable...');

    try {
        execSync(`chmod +x ${scriptPath}`);
        console.log(`Set executable permissions for: ${scriptPath}`);
    } catch (error) {
        console.error(`Failed to set permissions: ${error.message}`);
    }

    const bash = spawn('bash', ['-c', scriptPath]);

    bash.stdout.on('data', (data) => {
        console.log(`Bash Output: ${data}`);
    });

    bash.stderr.on('data', (data) => {
        console.error(`Bash Error Output: ${data}`);
    });

    bash.on('close', (code) => {
        if (code !== 0) {
            console.error(`Bash script exited with code ${code}`);
            return;
        }
        console.log('Bash script executed successfully.');

        // Copy executable to correct location
        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.error(`Error copying rebabel_convert: ${err.message}`);
            } else {
                console.log('rebabel_convert copied successfully');
            }
        });
    });
}