# EpiVis Development Guide

**Prerequisite:** this guide assumes that you have read and followed the
[frontend development guide](https://github.com/cmu-delphi/operations/blob/master/docs/frontend_development.md).

This guide describes how to run a local instance of the EpiVis website. See
[the Epidata API guide](https://github.com/cmu-delphi/delphi-epidata/blob/main/docs/epidata_development.md)
for much more detail.

# setup

For working on EpiVis, you'll need the following Delphi repositories:

- [operations](https://github.com/cmu-delphi/operations)
- [delphi-epidata](https://github.com/cmu-delphi/delphi-epidata)
- [www-epivis](https://github.com/cmu-delphi/www-epivis)

Your workspace should look like this after cloning:

```bash
tree -L 3 .
```

```
.
└── repos
    └── delphi
        ├── delphi-epidata
        ├── operations
        └── www-epivis
```

# build images

We now need an image for the EpiVis web server. This will be based on core
Delphi images which are defined in the
[`operations` repo](https://github.com/cmu-delphi/operations) which you cloned
above. The base image is built first, followed by the derived EpiVis image.

- The [`delphi_web_epivis` image](../dev/docker/web/epivis/README.md) adds
  the EpiVis website to the `delphi_web` image.

From the root of your workspace, the images can be built as follows:

```bash
docker build -t delphi_web \
  -f repos/delphi/operations/dev/docker/web/Dockerfile .

docker build -t delphi_web_epivis \
  -f repos/delphi/www-epivis/dev/docker/web/epivis/Dockerfile .
```

# run

At this point you're ready to bring the server online.

```bash
docker run --rm -p 127.0.0.1:10080:80 \
  --name delphi_web_epivis \
  delphi_web_epivis
```

You can view the website and manually test your changes by visiting the
following URL: http://localhost:10080/epivis/epivis.html

Alternatively, the server sources can be bind-mounted by passing the `--mount`
flag to `docker run`. Note however that this is not without drawbacks. See the
Epicast and Epidata API development guides for discussion of bind-mounting.

```
--mount type=bind,source="$(pwd)"/repos/delphi/www-epivis/site,target=/var/www/html/epivis,readonly
```

Note that by default the local site will pull live data from the Epidata API.
It's possible to swap out the live API with a local development instance,
however this requires some additional work. At a high level:

1. start containers `delphi_database_epidata` and `delphi_web_epidata` as
   described in the Epidata API development guide
2. edit the Epidata API javascript client, changing the base URL from the
   production value (like `delphi.cmu.edu`) to a local value (like `localhost`)
3. rebuild and restart the EpiVis container using the `delphi-net` network
