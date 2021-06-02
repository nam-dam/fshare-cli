import fs from 'fs';
import path from 'path';

import { FshareAPI } from './apis/fshare';

interface CliArguments {
  _: string;
  output?: string;
  credentials?: string;
}

function getFileUrls(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
}

(async function () {
  const argv: CliArguments = require('minimist')(process.argv.slice(2));
  const { _ } = argv;

  if (_.length === 0) {
    console.log('Action is missing');
    return;
  }

  if (_.length !== 2) {
    console.log('Action or InputFile is missing');
    return;
  }

  if (_[0] === 'download') {
    const { output, credentials } = argv;

    const filePath = path.resolve(_[1]);
    const fileUrls = getFileUrls(filePath);

    const credentialsPath = path.resolve(credentials!);
    const credentialJson = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

    const fshare = new FshareAPI(path.resolve(output!), credentialJson);
    await fshare.login();

    for (const fileUrl of fileUrls) {
      const directUrl = await fshare.getDownloadDirectUrl({ url: fileUrl });
      await fshare.download({ directUrl });
    }

    return;
  }

  console.log('Action is not supported');
})();
