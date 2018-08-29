const git = require('simple-git/promise');
const util = require('./util.js');

module.exports = class Repository {
    constructor(root) {
        this.root = root;
    }

    async init() {
        try {
            await util.createDirectory(this.root);
        } catch (e) {
            console.log(e);
        }

        this.repo = git(this.root);

        let isRepo;
        try {
            isRepo = await this.repo.checkIsRepo();
        } catch (e) {
            console.log(e);
        }

        if (!isRepo) {
            try {
                await this.repo.init();
            } catch (e) {
                console.log(e);
            }
        }
    }

    async commit(file, msg) {
        try {
            await this.repo.add(file);
            await this.repo.commit(msg);
        } catch (e) {
            console.log(e);
        }
    }
};

//function commitChanges(rel_file) {
//    new Promise((resolve, reject) => {
//        git.add(
//            rel_file
//        ).commit("automatic commit", (err) => {
//            if (err) {
//                reject(err);
//            } else {
//                resolve();
//            }
//        });
//    });
//}
