# Stripy Heifer <small>(Stripe PM take-home assignment for Mark Stafford)</small>

1. [Quick start](#quick-start)
2. [About Stripy Heifer](#about-stripy-heifer)
3. [Primary artifacts](#primary-artifacts)
4. [Cloning and running](#cloning-and-running)

## Quick start

If you just want to try the running product, check out <https://stripy-heifer-web.herokuapp.com/>. The Web client there is bound to a hosted API (<https://stripy-heifer-api.herokuapp.com/>) connected to my developer account.

The most meaningful feedback (friction log, suggestions for improvement) are captured in [Suggestions for improvement](suggestions-for-improvement.md) and [Progress log](progress-log.md)

## About Stripy Heifer

Stripy Heifer is a fictional non-profit intended to demonstrate the usage of Stripe payment APIs. Stripy Heifer is a crowdsourced initiative, allowing some users to create donation opportunities in their local currency, and other users to fulfill those donation opportunities.

## Primary artifacts

The primary artifacts worth reviewing are:

- This [readme](readme.md)
- The [progress log](progress-log.md)
- [Suggestions for improvement](suggestions-for-improvement.md)
- [app.js](api/app.js)
- [CheckoutForm.js](web/CheckoutForm.js)

## Cloning and running

There are four steps to running `stripy-heifer`:

1. Clone the repository
2. Create `.env` files
3. Run `yarn` from the root folder (to install `concurrently`)
4. Run `yarn start` (or `npm start`)

Note: the 4th step will take several minutes, given the number of packages it needs to install for the `web` project. The installation progress tends to get obscured in the console due to the fact that the API project spins up quickly and takes over the console output.

### Clone the repository

The `stripy-heifer` repository can be cloned by running:

```sh
git clone https://www.github.com/markdstafford/stripe-pmtha
```

### Create `.env` files

Once cloned, rename `.env.example` to `.env` in the `api` and `web` folders and populate with the appropriate values.

In the API `.env`:

- Set `PUBLISHABLE_KEY` to the value of your Stripe API publishable key (test key recommended)
- Set `SECRET_KEY` to the value of your Stripe API secret key (test key recommended)

In the web `.env`:

- Update `REACT_APP_API_BASE` if you need to change the URL or port the API is listening on, alternatively use https://stripy-heifer-web.herokuapp.com/ to make payments/see Webhooks connected to my developer account.

### Run `yarn` from the root folder

This repo uses `concurrently` to simultaneously launch the API and Web client. You will need to run `yarn` from the root folder to install `concurrently`.

### Run `yarn start`

The API and client may be started in one of two ways:

1. By running `yarn start` (or `npm start`) from the root directory (uses [concurrently](https://www.npmjs.com/package/concurrently))
2. By running `yarn start` (or `npm start`) from both the `api` and `web` folders respectively

Note that the first launch of the project will take several minutes as yarn/npm install the required packages into the Web client.
