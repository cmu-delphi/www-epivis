# Delphi EpiVis

[![License: MIT][mit-image]][mit-url] [![Github Actions][github-actions-image]][github-actions-url] [![Netlify Status][netlify-image]][netlify-url]

An interactive tool for visualizing epidemiological time-series data.

The site is live at https://delphi.cmu.edu/epivis/

The current stable `main` version is deployed at https://cmu-delphi-epivis.netlify.app/.

The next `dev` version is deployed at https://dev--cmu-delphi-epivis.netlify.app/.

For development, see the
[EpiVis development guide](docs/epivis_development.md).

Little piece of trivia: the first version of EpiVis was written on 2014-12-22.
See the git history of this file for a legacy changelog which describes changes
made prior to the migration to git around 2017.

## Development Environment

One click solution: [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/cmu-delphi/www-epivis)

`node` and `npm` are required for development.

To begin development, clone this repository and run

```sh
npm install
```

To lint or check for styling, run

```sh
npm run lint
```

To run unit test, run

```sh
npm test
```

To run the development server, run

```sh
npm start
```

the website is then accessible via: http://localhost:8080/

### Release Process

The release consists of multiple steps which can be all done via the GitHub website:

1. Go to [create_release GitHub Action](https://github.com/cmu-delphi/www-epivis/actions/workflows/create_release.yml) and click the `Run workflow` button. Enter the next version number or one of the magic keywords (patch, minor, major) and hit the green `Run workflow` button.
1. The action will prepare a new release and will end up with a new [Pull Request](https://github.com/cmu-delphi/www-epivis/pulls)
1. Let the code owner review the PR and its changes and let the CI check whether everything builds successfully
1. Once approved and merged, another GitHub action job starts which automatically will
   1. create a git tag
   1. create another [Pull Request](https://github.com/cmu-delphi/www-epvis/pulls) to merge the changes back to the `dev` branch
   1. create a [GitHub release](https://github.com/cmu-delphi/www-epivis/releases) with automatically derived release notes
   1. create a [Pull Request in www-main](https://github.com/cmu-delphi/www-main/pulls) to update the website to the new release
1. Done

## License

This repository is released under the **MIT License**.

[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[github-actions-image]: https://github.com/cmu-delphi/www-epivis/workflows/ci/badge.svg
[github-actions-url]: https://github.com/cmu-delphi/www-epivis/actions
[netlify-image]: https://api.netlify.com/api/v1/badges/9ecc1d05-6a4e-4848-a7ad-f4490b0a26aa/deploy-status
[netlify-url]: https://app.netlify.com/sites/cmu-delphi-epivis/deploys
