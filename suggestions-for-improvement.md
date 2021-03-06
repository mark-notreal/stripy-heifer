# Suggestions for improvement

Overall my developer journey was comparatively spectacular. That said, since I was asked to gather friction points, there were several places that I noted opportunity for improvement. In chronological order, as I noted them:

1. Find a different term than `client secret` to describe the key for the payment intent. Client secret has a very special meaning in [OAuth](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/), which immediately let me to believe that the client secret referred to here was something different than it is. `payment id` or something similar might be a more appropriate, less overloaded term.
2. Link the samples to the docs better. (Note: was primarily an artifact of having been given a specific set of links to work with, it looks like the main stripe.com/docs page is well linked.) Possible options:
   - Search has a special link to the GitHub organization [stripe-samples] when searching for `sample`.
   - Link the [stripe-samples] organization in top or left nav of docs.
   - The [stripe] organization links to [stripe-samples] directly from the description.
   - Sample repos are merged into the [stripe] organization.
3. Make the Stripe CLI installable via `npm` or runnable via `npx`. I avoided installing it because I'm on Windows and I didn't want to deal with Sqoop.
4. Add comments to the sample server code to clarify the intent of code. You can never have too many comments in samples.
5. Don't over-CAPTCHA. I was presented with two CAPTCHAs in a row when logging in on a new browser and then confirming my e-mail address. (I think this counts as the bonus points mentioned for finding a bug. ;))
6. Use consistent terminology. Is it `public key` or `publishable key`? The dashboard and docs consistently use `publishable key`, but the sample mostly uses `public key`.
7. The two biggest gaps I found in the API were:
   1. Payment intents are locked to one currency and one amount. This likely has completely sound reasoning (e.g., the fundamental system doesn't support a payment with multiple amounts/currencies) but it was disappointing to have to deal with this myself. My app presumed a crowdsource funding model where different donations might require different currencies. I can combine all the donations for a single currency and split out the payments, but if there are multiple currencies involved I have to pass that pain on to the user of the app. :(
   2. There wasn't a readily available currency conversion API. It does look like Stripe handles currency conversion internally in certain cases (<https://stripe.com/docs/currencies/conversions>) but if I wanted to work around the prior issue by converting EUR to USD, I couldn't find an API for that. Maybe I could call some other FX API, but that leaves me eating the difference in conversion between what Stripe charges and what the FX API claims.

[stripe]: https://www.github.com/stripe
[stripe-samples]: https://www.github.com/stripe-samples
