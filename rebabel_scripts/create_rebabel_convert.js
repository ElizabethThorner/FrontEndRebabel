const fs = require('fs');
const { spawn, execSync } = require('child_process');
const path = require('path');
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

// delete previous build files
deleteIfExists(path.join(__dirname, 'build'));
deleteIfExists(path.join(__dirname, 'dist'));
deleteIfExists(path.join(__dirname, 'rebabel_convert.spec'));

// define script paths
const setupVenvPath = path.join(__dirname, isWindows ? 'setup_venv.ps1' : 'setup_venv');
const setupExecutablePath = path.join(__dirname, isWindows ? 'setup_executable.ps1' : 'setup_executable');

// define source and destination for created executable
const sourcePath = path.join(__dirname, 'dist', isWindows ? 'rebabel_convert.exe' : 'rebabel_convert');
const destinationPath = path.join('node_modules', 'electron', 'dist',
    isMac ? 'Electron.app/Contents/Resources' : 'resources', // on mac, the destination is different
    isWindows ? 'rebabel_convert.exe' : 'rebabel_convert' // on windows, add .exe extension
);

// create virtual environment if needed, then create executable
if (!fs.existsSync(path.join(__dirname, '.venv'))) {
    console.log('No virtual environment detected...');
    executeScript(setupVenvPath, 'setup_venv', () => {
        // run setup_executable after setup_venv completes
        executeScript(setupExecutablePath, 'setup_executable', () => {
            // copy executable to the correct location after setup_executable completes
            fs.copyFile(sourcePath, destinationPath, (err) => {
                if (err) {
                    console.error(`Error copying rebabel_convert: ${err.message}`);
                } else {
                    console.log('rebabel_convert copied successfully');
                }
            });
        });
    });
} else {
    console.log('Virtual environment detected, skipping setup_venv.');
    executeScript(setupExecutablePath, 'setup_executable', () => {
        // copy executable to the correct location after setup_executable completes
        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.error(`Error copying rebabel_convert: ${err.message}`);
            } else {
                console.log('rebabel_convert copied successfully');
            }
        });
    });
}

// function definitions
// function for deleting previous build files
function deleteIfExists (path) {
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

// function for executing scripts
function executeScript(scriptPath, scriptName, onSuccess) {
    // powershell vs bash
    const shell = isWindows ? 'powershell.exe' : 'bash';
    const shellArgs = isWindows ? ['-ExecutionPolicy', 'Bypass', '-File', scriptPath] : ['-c', scriptPath];

    console.log(`Executing ${scriptName}...`);
    const process = spawn(shell, shellArgs);

    // output logging
    process.stdout.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`${scriptName} console: ${message}`);
    });

    process.stderr.on('data', (data) => {
        const errorMessage = data.toString().trim();
        if (errorMessage.toLowerCase().includes('info') || errorMessage.toLowerCase().includes('git clone')) {
            // not actually an error
            console.log(`${scriptName}: ${errorMessage}`);
        } else {
            // error
            console.error(`${scriptName} error: ${errorMessage}`);
        }
    });

    // handle on close
    process.on('close', (code) => {
        if (code !== 0) {
            console.error(`${scriptName} exited with code ${code}`);
            return;
        }
        console.log(`${scriptName} executed successfully`);
        if (onSuccess) onSuccess();
    });
}
