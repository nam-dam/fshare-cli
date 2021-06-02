# Fshare Command Line Interface

This is an executable binary for downloading files from fshare.vn

## Usage:

```
$ ./bin/fshare-cli download --credentials /path/to/credentials --output /path/to/output /path/to/input-file
```

Input file and credentials will have the correct format in env.sample directory

## Options:

    download                             Download urls from input file

## Params:

    --credentials CREDENTIALS_PATH       Path to the credentials file
    --output DOWNLOAD_PATH               Path to the download directory

# License

MIT

# TODO

- Fetching files from public folder url
- Tracking downloads and resuming
