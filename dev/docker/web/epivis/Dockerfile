# start with the `delphi_web` image
FROM delphi_web

# deploy the EpiVis website (see `www-epivis/deploy.json`)
COPY repos/delphi/www-epivis/site /var/www/html/epivis

# grab the javascript client library for the Epidata API (it's not included in
# this repo)
COPY repos/delphi/delphi-epidata/src/client/delphi_epidata.js /var/www/html/epidata/lib/delphi_epidata.min.js

RUN chmod o+r /var/www/html/epivis/* /var/www/html/epidata/*
