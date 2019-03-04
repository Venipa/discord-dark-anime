const fs = require('fs');
const path = require('path');
let header = require('./bd.json');
let config = require('./config.json');
let pkg = require('./package.json');
const parseConfig = cssType => {
  let run = () => {
    console.log('running parseConfig');
    let icon = fs.readFileSync('./src/resources/logo@0,25x.svg').toString('base64');
    let destConfig = path.resolve(config.paths.config);
    console.log(`Config Path: ${destConfig}`);
    let mainCss = `${config.coreStyle}.${cssType || 'css'}`;
    console.log(`CSS In: ${mainCss}`);
    let configData = {
      info: {
        name: header.name,
        authors: header.authors,
        version: pkg.version,
        description: header.description,
        icon: `data:image/svg+xml;base64,${icon}`,
        type: cssType
      },
      main: mainCss,
      defaultConfig: []
    };
    fs.writeFile(
      destConfig,
      JSON.stringify(configData),
      {
        encoding: 'utf8'
      },
      err => {
        if (err) {
          return console.error(err);
        }
        console.log('config has been saved');
      }
    );
  };
  try {
      run();
  } catch(err) {
      console.error(err);
      throw(err);
  }
};
exports.parseConfig = parseConfig;
