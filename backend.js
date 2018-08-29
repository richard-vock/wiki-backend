const Repository = require('./repository.js');
const util = require('./util.js');

module.exports = class Backend {
    constructor(options) {
        this.options = options,
        this.repo = new Repository(options.root);
    }

    async init() {
        await this.repo.init();
    }

    async createDirectory(path) {
        return util.createDirectory(this.repo.root + path);
    }

    async write(filePath, content) {
        var path = require('path')
        var dir = path.dirname(this.repo.root + filePath);

        try {
            await util.createDirectory(dir);
            await util.writeFile(this.repo.root + filePath, content);
            await this.repo.commit(filePath.slice(1), "Saved Entry");
        } catch (e) {
            console.log('Unable to save entry "' + filePath + '\":');
            console.log(e);
        }
    }

    async read(filePath) {
        return util.readFile(this.repo.root + filePath);
    }

    async remove(p) {
        let isDir = await util.pathIsDirectory(this.repo.root + p);
        if (isDir) {
            await util.removeDirectoryRecursive(this.repo.root + p);
        } else {
            await util.removeFile(this.repo.root + p);
        }
        await this.repo.commit(p.slice(1), "Removed Entry");
    }

    async isDirectory(path) {
        return util.pathIsDirectory(this.repo.root + path);
    }

    async isFile(path) {
        return util.pathIsFile(this.repo.root + path);
    }

    async list(dirPath) {
        let ls;
        try {
            ls = await util.listDirectory(this.repo.root + dirPath);
            ls = ls.filter(entry => !entry.startsWith('.'));
        } catch (e) {
            // expected to fail for non-directories
            return [];
        }

        return Promise.all(ls.map(async (entry) => {
            let fullPath = this.repo.root + dirPath.replace(/\/+$/, '') + '/' + entry;
            try {
                let isDir = await util.pathIsDirectory(fullPath);
                if (isDir) {
                    return entry + '/';
                    //fullPath = fullPath + '/';
                }
            } catch (e) {
                console.log(e);
            }
            //return fullPath;
            return entry;
        }));
    }
}
