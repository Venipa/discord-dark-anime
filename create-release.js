const config = require('./config.json');
const fs = require('fs');
const header = require('./bd.json');
const pkg = require('./package.json');
const path = require('path');
const url = require('url');
let github = {
    releaseUrl: url.resolve(url.resolve(
        url.resolve(config.github.raw, config.github.repository),
        config.github.fileRoot), 'releases/')
};
let distPath = path.resolve(config.paths.destination);
let releasePath = path.resolve('releases');
let importPath = path.resolve(releasePath, 'import');
let distFile = path.resolve(config.paths.destination, config.coreStyle + '.css');
let releaseFile = path.resolve(releasePath, config.coreStyle + '.css');
let importFile = path.resolve(importPath, pkg.name + '.theme.css');

if (!fs.existsSync(distPath) || !fs.existsSync(distFile)) {
    console.error('missing dist');
    return;
}
if (!fs.existsSync(releasePath)) {
    fs.mkdirSync(releasePath, 777);
}
if (!fs.existsSync(importPath)) {
    fs.mkdirSync(importPath, 777);
}
fs.copyFileSync(distFile, releaseFile);
const dist = fs.readFileSync(releaseFile).toString();
let distRx = dist.split('\n');
if (distRx.length > 1) {
    distRx.splice(0, 1);
    fs.writeFileSync(releaseFile, distRx.join('\n').toString());
} else {
    distRx = undefined;
}

const releaseTemplate = fs.readFileSync('./src/templates/release.template').toString();
const license = fs.readFileSync('./LICENSE').toString();
header.name = pkg.description;
header.version = pkg.version;
header.author = pkg.author;

const releaseStyle = releaseTemplate
.replace(':bd-header', '//META' + JSON.stringify(header) + '*//')
.replace(':license', license)
.replace(':packageName', pkg.description)
.replace(':authorName', pkg.author)
.replace(':packageVersion', pkg.version)
.replace(':packageDescription', header.description)
.replace(':releaseUrl', url.resolve(github.releaseUrl, config.coreStyle + '.css'));
fs.writeFileSync(importFile, releaseStyle.toString());


console.log(github.releaseUrl);