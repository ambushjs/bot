const https = require('https');

function getList(lang) {
    return new Promise((resolve, reject) => {
        https.get('https://wandbox.org/api/list.json', (res) => {
            let result = '';

            res.on('data', (d) => {
                result += d;
            });

            res.on('close', () => {
                const list = [];
                const dataList = JSON.parse(result);

                if (lang) {
                    const langToCheck = lang.toLowerCase();

                    dataList.forEach((compiler) => {
                        if (compiler.language.toLowerCase() === langToCheck) {
                            list.push(compiler);
                        }
                    });

                    list.length === 0 ?
                        reject(`No matching compilers found for ${lang}.`) :
                        resolve(list);
                } else {
                    resolve(dataList);
                }
            });

            res.on('error', (e) => {
                reject(`[${e.name}]: ${e.message}`);
            });
        });
    });
};

function fromString(opts) {
    return new Promise((resolve, reject) => {
        if (!opts.code || opts.code.length === 0) {
            reject('No source provided.');
        }

        getList().then((list) => {
            let found = false;

            list.forEach((compiler) => {
                if (compiler.name.toLowerCase() === opts.compiler.toLowerCase()) {
                    found = true;
                }
            });

            if (!found) {
                reject('Invalid compiler supplied.');
            } else {
                const post_data = JSON.stringify(opts);

                const params = {
                    hostname: 'wandbox.org',
                    port: 443,
                    path: '/api/compile.json',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(post_data)
                    }
                };

                let e = null;

                let data = '';
                let start = Date.now();

                const req = https.request(params, (res) => {
                    res.setEncoding('utf8');

                    res.on('data', (chunk) => {
                        if (Date.now() - start > opts.timeout) {
                            e = new Error('Request Timed out.');
                            req.destroy();
                        }

                        data += chunk;
                    });

                    res.on('close', () => {
                        if (e) {
                            data = '{ "response":"Request timed out." }';
                            reject(`[${e.name}]: ${e.message}`);
                        } else {
                            try {
                                resolve(JSON.parse(data));
                            } catch (err) {
                                reject(`[${err.name}]: ${err.message}`);
                            }
                        }
                    });
                });

                req.on('error', (error) => {
                    e = error;
                });

                req.write(post_data);
                req.end();
            }
        }).catch(reject);
    });
};

exports.getList = getList;
exports.fromString = fromString;
