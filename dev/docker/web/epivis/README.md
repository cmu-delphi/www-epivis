# `delphi_web_epivis`

This image starts with Delphi's web server and adds the sources necessary for
hosting EpiVis, Delphi's epidata visualization website.

To start a container from this image, run:

```bash
docker run --rm -p 10080:80 --name delphi_web_epivis delphi_web_epivis
```

You should be able to view the site by visiting (or `curl`ing)
http://localhost:10080/epivis/epivis.html.
