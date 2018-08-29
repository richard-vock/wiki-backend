var fs = require('fs-extra');
//var fs = require('fs').promises;

async function pathExists(p) {
    let exists = true;
    try {
        await fs.access(p);
    } catch (e) {
        exists = false;
    }

    return exists;
}

async function pathIsFile(p) {
    let state;
    try {
        stat = await fs.stat(p);
        state = stat.isFile();
    } catch (e) {
        state = false;
    }

    return state;
}

async function pathIsDirectory(p) {
    let state;
    try {
        stat = await fs.stat(p);
        state = stat.isDirectory();
    } catch (e) {
        state = false;
    }

    return state;
}

async function createDirectory(dir) {
    try {
        let exists = await pathExists(dir);
        if (!exists) {
            let mkdir = require('mkdir-promise');
            await mkdir(dir);
        }
    } catch (e) {
        console.log(e);
    }
}

async function readFile(filename) {
    let exists;
    let isFile;
    try {
        exists = await pathExists(filename)
        if (exists) {
            isFile = await pathIsFile(filename);
        }
    } catch (e) {
        console.log(e);
    }

    if (!exists) {
        throw new Error('Trying to read non-existing or write-only file "' + filename + '"');
    }

    if (!isFile) {
        throw new Error('Expected file but found directory "' + filename + '"');
    }

    let content;
    try {
        content = await fs.readFile(filename, 'utf8');
    } catch (e) {
        console.log(e);
    }

    return content;
}

async function writeFile(filename, content) {
    try {
        await fs.writeFile(filename, content)
    } catch (e) {
        console.log(e);
    }
}

async function removeFile(filename) {
    let exists;
    let isFile;
    try {
        exists = await pathExists(filename)
        if (exists) {
            isFile = await pathIsFile(filename);
        }
    } catch (e) {
        console.log(e);
    }

    if (!exists) {
        throw new Error('Trying to delete non-existing or write-only file "' + filename + '"');
    }

    if (!isFile) {
        throw new Error('Expected file but found directory "' + filename + '"');
    }

    try {
        await fs.unlink(filename)
    } catch (e) {
        console.log(e);
    }
}

async function listDirectory(dir) {
    let exists;
    let isDir;
    try {
        exists = await pathExists(dir);
        if (exists) {
            isDir = await pathIsDirectory(dir);
        }
    } catch (e) {
        console.log(e);
    }

    if (!exists) {
        throw new Error('Trying to list non-existing or inaccessible directory "' + dir + '"');
    }

    if (!isDir) {
        throw new Error('Expected directory but found file "' + dir + '"');
    }

    let content;
    try {
        content = fs.readdir(dir);
    } catch (e) {
        console.log(e);
    }

    return content;
}

async function removeDirectoryRecursive(dir) {
    let isDir = await pathIsDirectory(dir);
    if (!isDir) return;

    let subs = await listDirectory(dir);
    for (sub in subs) {
        let p = dir + '/' + subs[sub];
        isDir = await pathIsDirectory(p);
        if (isDir) {
            await removeDirectoryRecursive(p);
        } else {
            await removeFile(p);
        }
    }
    await fs.rmdir(dir)
}

module.exports.pathExists = pathExists;
module.exports.pathIsFile = pathIsFile;
module.exports.pathIsDirectory = pathIsDirectory;
module.exports.createDirectory = createDirectory;
module.exports.readFile = readFile;
module.exports.writeFile = writeFile;
module.exports.removeFile = removeFile;
module.exports.listDirectory = listDirectory;
module.exports.removeDirectoryRecursive = removeDirectoryRecursive;
