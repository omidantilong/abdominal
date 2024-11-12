# abdominal

A nice(r) way to work on a/b tests locally, with live browser preview and improved build tooling.

Uses [Puppeteer](https://pptr.dev/) for local development and [Rollup](https://rollupjs.org/) for bundling.

### Installation

```
nvm install
npm install
```

### Configuring

Experiments are stored in `experiments`, with one directory per experiment, like so:

```
.
└── experiments/
    ├── ab-1/
    │   ├── config.json
    │   ├── variant.js
    │   └── ...
    └── ab-2/
        └── ...
```

Each directory in `experiments` must have a `config.json` that uses the following schema. You can define as many variants for each experiment as you like, and you can toggle between each variant when the browser launches.

```
{
  "url": "http://example.com",
  "variants": [
    {
      "file": "variant.js",
      "note": "A short description of what the variant script does"
    }
  ]
}
```

### Launching

Given that directory structure, you can now run:

```
npm run launch ab-1
```

This will start a Puppeteer instance and load the URL defined in `config.json`, with `variant.js` injected into the page. The page will automatically update when you save changes to `variant.js`.

The launch command can also take a second parameter to activate a specific variant on page load:

```
npm run launch ab-1 variant.js
```

### Building

To build for production, run:

```
npm run build ab-1
```

This will output a minified version of each configured variant into `dist` inside the experiment folder. As with the launch script, you can pass a second parameter to build just one specific variant if necessary.

Minification is handled by [terser](https://terser.org/). The bundled output is wrapped into an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) by Rollup, ready to be shipped off to Adobe Target.

### TODO

- ~~Proper HMR (or at least live reload)~~
- ~~Don't rebuild bundle when reloading page in browser~~
- ~~Find another way to trigger script injection that doesnt rely on DOMContentLoaded (so that tests can use this event themselves? Not sure how useful this is as I think Target tests will always be added after DOMContentLoaded anyway)~~
- ~~Optionally define scripts in config rather than explicitly running with CLI. Config could specify scripts to run as part of the experiment, and launch script could allow selecting which ones to run/enable in a browser widget. Would also allow one build command to build multiple scripts if necessary~~
- Preview multiple tests simultaneously on the same page
- Test harness (stick with Puppeteer or use Playwright? Should CLI syntax use same positionals as launch/build?)
