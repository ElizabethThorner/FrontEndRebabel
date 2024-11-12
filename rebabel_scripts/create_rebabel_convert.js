const fs = require('fs');
const { spawn, execSync } = require('child_process');
const path = require('path');
const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

// delete previous build files
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

deleteIfExists(buildPath);
deleteIfExists(distPath);
deleteIfExists(specPath);

if (isWindows) {
    const venvPath = path.join(__dirname, '.venv');
    const setupVenvPath = path.join(__dirname, 'setup_venv.ps1');
    const setupExecutablePath = path.join(__dirname, 'setup_executable.ps1');
    const sourcePath = path.join(__dirname, 'dist', 'rebabel_convert.exe');
    const destinationPath = path.join('node_modules', 'electron', 'dist', 'resources', 'rebabel_convert.exe');

    // setup virtual environment if needed
    if (!fs.existsSync(venvPath)) {
        console.log('No virtual environment detected...');
        console.log('Executing setup_venv...');
        const ps_venv = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', setupVenvPath]);

        // output
        ps_venv.stdout.on('data', (data) => {
            console.log(`setup_venv output: ${data}`);
        });

        // error output
        ps_venv.stderr.on('data', (data) => {
            console.error(`setup_venv error output: ${data}`);
        });

        // close
        ps_venv.on('close', (code) => {
            if (code !== 0) {
                console.error(`setup_venv exited with code ${code}`);
                return;
            }
            console.log('setup_venv executed successfully.');
        });
    }
    else {
        console.log('Virtual environment detected...');
        console.log('Skipping setup_venv...');
    }

    // create executable
    console.log('Executing setup_executable...');
    const ps_executable = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', setupExecutablePath]);

    // output
    ps_executable.stdout.on('data', (data) => {
        console.log(`setup_executable output: ${data}`);
    });

    // error output
    ps_executable.stderr.on('data', (data) => {
        console.error(`setup_executable error output: ${data}`);
    });

    // close
    ps_executable.on('close', (code) => {
        if (code !== 0) {
            console.error(`setup_executable exited with code ${code}`);
            return;
        }
        console.log('setup_executable executed successfully.');

        // copy executable to correct location
        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.error(`error copying rebabel_convert.exe: ${err.message}`);
            } else {
                console.log('rebabel_convert.exe copied successfully');
            }
        });
    });
}
else {
    const venvPath = path.join(__dirname, '.venv');
    const setupVenvPath = path.join(__dirname, 'setup_venv');
    const setupExecutablePath = path.join(__dirname, 'setup_executable');
    const sourcePath = path.join(__dirname, 'dist', 'rebabel_convert');
    const linuxDestination = path.join('node_modules', 'electron', 'dist', 'resources', 'rebabel_convert');
    const macDestination = path.join('node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'Resources', 'rebabel_convert');
    const destinationPath = isMac ? macDestination : linuxDestination;

    // setup virtual environment if needed
    if (!fs.existsSync(venvPath)) {
        console.log('No virtual environment detected...');

        // grant script permissions
        try {
            execSync(`chmod +x ${setupVenvPath}`);
            console.log(`Granted permissions for: ${setupVenvPath}`);
        } catch (error) {
            console.error(`Failed to grant permissions: ${error.message}`);
        }
        
        console.log('Executing setup_venv...');
        const bash_venv = spawn('bash', ['-c', setupVenvPath]);

        // output
        bash_venv.stdout.on('data', (data) => {
            console.log(`setup_venv output: ${data}`);
        });

        // error output
        bash_venv.stderr.on('data', (data) => {
            console.error(`setup_venv error output: ${data}`);
        });

        // close
        bash_venv.on('close', (code) => {
            if (code !== 0) {
                console.error(`setup_venv exited with code ${code}`);
                return;
            }
            console.log('setup_venv executed successfully.');
        });
    }
    else {
        console.log('Virtual environment detected...');
        console.log('Skipping setup_venv...');
    }

    // grant script permissions
    try {
        execSync(`chmod +x ${setupExecutablePath}`);
        console.log(`Granted permissions for: ${setupExecutablePath}`);
    } catch (error) {
        console.error(`Failed to grant permissions: ${error.message}`);
    }

    // create executable using bash script
    console.log('Executing setup_executable...');
    const bash_executable = spawn('bash', ['-c', setupExecutablePath]);

    // output
    bash_executable.stdout.on('data', (data) => {
        console.log(`setup_executable output: ${data}`);
    });

    // error output
    bash_executable.stderr.on('data', (data) => {
        console.error(`setup_executable error output: ${data}`);
    });

    // close
    bash_executable.on('close', (code) => {
        if (code !== 0) {
            console.error(`setup_executable exited with code ${code}`);
            return;
        }
        console.log('setup_executable executed successfully.');

        // copy executable to correct location
        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.error(`error copying rebabel_convert: ${err.message}`);
            } else {
                console.log('rebabel_convert copied successfully');
            }
        });
    });
}