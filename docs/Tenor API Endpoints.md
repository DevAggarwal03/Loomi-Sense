Tenor API Endpoints



Spark icon
Page Summary
This page provides information about each endpoint that's available through the Tenor API. For every endpoint, this page provides the following:

The base URL to use
Best practices to follow
The available parameters
The response format
Example requests in each language
Search
Base URL

https://tenor.googleapis.com/v2/search?<parameters>
Get a JSON object that contains a list of the most relevant GIFs for a given set of search terms, categories, emojis, or any combination of these.

When you include the URL parameter searchfilter=sticker in the request, Tenor's search endpoint returns stickers rather than GIFs. The Response Objects in sticker search responses include transparent formats under the media_formats field.

To return the results in a randomized order, instead of them being ordered by relevance, include the URL parameter random=true.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
Provide the user's search as typed, which includes its punctuation and special characters.
When a user decides which GIF or sticker to share, we recommend that you also include a corresponding call to the Register Share endpoint. This optional call helps Tenor's Search Engine AI tune its results.
To control the amount and flow of GIFs returned, use the limit and pos parameters. For example, you could set limit = 10 for the user's initial search results and load previews of those GIFs for the user to browse. If the user requests more results, collect the next 10 results by making the same API call but with pos set to the value of the next field from the initial response. You can use this pattern to create a smooth lazy loading experience. This helps keep bandwidth usage down and provides a quicker response time for the user, because fewer GIF previews need to be loaded in parallel on the client's side.
To maintain your internal content safety ratings for GIFs returned, use the ContentFilter parameter. The default value is off.
To reduce the number of content formats returned, use the media_filter parameter. This can reduce the Response Object size by over 70%.
Parameters
The following table provides details on the parameters for the Search endpoint:

Parameters
key	
Required

string

API key for privileged access

Doesn't have a default value.

q	
Required

string

A search string

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

searchfilter	
Optional

string

Comma-separated list of non-GIF content types to filter the Response Objects. By default, searchfilter returns GIF content only.

Doesn't have a default value. The accepted values are sticker, static, and -static:

searchfilter=sticker returns both static and animated sticker content.
searchfilter=sticker,-static returns only animated sticker content.
searchfilter=sticker,static returns only static sticker content.
For GIF content, either leave searchfilter blank or don't use it.
country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

contentfilter	
Strongly recommended

enum

Specify the content safety filter level.

The default value is off. The accepted values are off, low, medium, and high.

media_filter	
Strongly recommended

string

Comma-separated list of GIF formats to filter the Response Objects. By default, media_filter returns all formats for each Response Object.

Example: media_filter=gif,tinygif,mp4,tinymp4

Doesn't have a default value.

ar_range	
Strongly recommended

string

Filter the Response Objects to only include GIFs with aspect ratios that fit within the selected range.

The default value is all. The accepted values are all, wide, and standard:

all: No constraints
wide: 0.42 <= aspect ratio <= 2.36
standard: 0.56 <= aspect ratio <= 1.78
random	
Optional

boolean

Specify whether to randomly order the response. The default value is false, which orders the results by Tenor's relevancy ranking.

The accepted values are true and false.

limit	
Optional

integer

Fetch up to the specified number of results.

The default value is 20, and the maximum value is 50.

pos	
Optional

string

Retrieve results that start at the position "value". Use a non-zero, non-empty value from next, returned by the API response, to get the next set of results. pos isn't an index and might be an integer, float, or string.

Doesn't have a default value.

Response format
The following table provides details on the response format for the Search endpoint:

Key
next	
string

A position identifier to use with the next API query, through the pos field, to retrieve the next set of results. If there are no further results, next returns an empty string.

results	
RESPONSE_OBJECT[]

An array of Response Objects that contains the most relevant content for the requested search term. The content is sorted by its relevancy Rank.

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* search for excited top 8 GIFs */
curl "https://tenor.googleapis.com/v2/search?q=excited&key=API_KEY&client_key=my_test_app&limit=8"
Featured
Base URL

https://tenor.googleapis.com/v2/featured?<parameters>
Get a JSON object that contains a list of the current global featured GIFs. Tenor updates the featured stream regularly throughout the day.

When the URL parameter searchfilter=sticker is included in the request, Tenor's Featured endpoint returns stickers rather than GIFs. In sticker featured responses, Response Objects include transparent formats under the media field.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
When a user decides which GIF or sticker to share, we recommend that you also include a corresponding call to the Register Share endpoint. This optional call helps Tenor's Search Engine AI tune its results.
To control the amount and flow of GIFs returned and loaded, use the limit and pos parameters. For example, you could set limit = 10 for the user's initial trending request results and load previews of those GIFs for the user to browse. If the user requests more results, collect the next 10 results by making the same API call but with pos set to the value of the next field from the initial response. You can use this pattern to create a smooth lazy loading experience. This helps keep bandwidth usage down and provides a quicker response time for the user, because fewer GIF previews need to be loaded in parallel on the client's side.
To specify the appropriate GIF content safety rating for your service or application, use the ContentFilter parameter.
To reduce the number of GIF formats returned, use the media_filter parameter. This can reduce the Response Object size by 75%.
Parameters
The following table provides details on the parameters for the Featured endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

The client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

searchfilter	
Optional

string

Comma-separated list of non-GIF content types to filter the Response Objects. By default, searchfilter returns GIF content only.

Doesn't have a default value. The accepted values are sticker, static, and -static.

searchfilter=sticker returns both static and animated sticker content.
searchfilter=sticker,-static returns only animated sticker content.
searchfilter=sticker,static returns only static sticker content.
For GIF content, either leave searchfilter blank or don't use it.
country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

media_filter	
Strongly recommended

string

Comma-separated list of GIF formats to filter the Response Objects. By default, media_filter returns all formats for each Response Object.

Example: media_filter=gif,tinygif,mp4,tinymp4

Doesn't have a default value.

ar_range	
Strongly recommended

string

Filter the Response Objects to only include GIFs with aspect ratios that fit within the selected range.

The default value is all. The accepted values are all, wide, and standard:

all: No constraints
wide: 0.42 <= aspect ratio <= 2.36
standard: 0.56 <= aspect ratio <= 1.78
contentfilter	
Strongly recommended

enum

Specify the content safety filter level.

The default value is off. The accepted values are off, low, medium, and high.

limit	
Optional

integer

Fetch up to the specified number of results.

The default value is 20, and the maximum value is 50.

pos	
Optional

string

Retrieve results that start at the position "value". Use a non-zero, non-empty value from next, returned by the API response, to get the next set of results. pos isn't an index and might be an integer, float, or string.

Doesn't have a default value.

Response format
The following table provides details on the response format for the Featured endpoint:

Key
next	
string

A position identifier to use with the next API query, through the pos field, to retrieve the next set of results. If there are no further results, next returns an empty string.

results	
RESPONSE_OBJECT[]

An array of Featured Response Objects.

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* Featured GIFs call */
curl "https://tenor.googleapis.com/v2/featured?key=API_KEY&client_key=my_test_app"
Categories
Base URL

https://tenor.googleapis.com/v2/categories?<parameters>
Get a JSON object that contains a list of GIF categories associated with the provided type. Each category includes a corresponding search URL to use if the user clicks on the category. The search URL includes any parameters from the original call to the Categories endpoint.

Supported types
featured (default): The current featured emotional or reaction-based GIF categories. This includes a preview GIF for each term.
trending: The current trending search terms. This includes a preview GIF for each term.
Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
Use the locale parameter to convert category names to the user's language. The default value is en_US.
To specify the appropriate GIF content safety rating for your service or application, use the ContentFilter parameter. When used, the ContentFilter parameter is passed through to all search URLs found in the categories Response Object.
Parameters
The following table provides details on the parameters for the Categories endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

type	
Strongly recommended

string

Determines the type of categories returned.

The default value is featured. The accepted values are featured and trending.

contentfilter	
Strongly recommended

enum

Specify the content safety filter level.

The default value is off. The accepted values are off, low, medium, and high.

Response format
The following table provides details on the response format for the Categories endpoint:

Key
tags	
CATEGORY_OBJECT[]

An array of CATEGORY_OBJECTS where the name field has been translated into the locale language.

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* categories call */
curl "https://tenor.googleapis.com/v2/categories?key=API_KEY&client_key=my_test_app"
Search Suggestions
Base URL

https://tenor.googleapis.com/v2/search_suggestions?<parameters>
Get a JSON object that contains a list of alternative search terms for a given search term.

Search suggestions help a user narrow their search or discover related search terms to find a more precise GIF. The API returns results in order of what is most likely to drive a share for a given term, based on historic user search and share behavior.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
Display the results in the order provided by the response.
Parameters
The following table provides details on the parameters for the Search Suggestions endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

q	
Required

string

A search string

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

limit	
Optional

integer

Fetch up to the specified number of results.

The default value is 20, and the maximum value is 50.

Response format
The following table provides details on the response format for the Search Suggestions endpoint:

Key
results	
string[]

An array of suggested search terms

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* search suggestion */
curl "https://tenor.googleapis.com/v2/search_suggestions?key=API_KEY&client_key=my_test_app&q=smile&limit=5"
Autocomplete
Base URL

https://tenor.googleapis.com/v2/autocomplete?q=<term>&key=<API KEY>
Get a JSON object that contains a list of completed search terms for a given partial search term. The list is sorted by Tenor's AI and the number of results decreases as Tenor's AI becomes more certain.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
Use the locale parameter to adjust the results to the user's language. The default value is en_US.
Display the results in the order provided by the response.
Parameters
The following table provides details on the parameters for the Autocomplete endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

q	
Required

string

A search string

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

limit	
Optional

integer

Fetch up to the specified number of results.

The default value is 20, and the maximum value is 50.

Response format
The following table provides details on the response format for the Autocomplete endpoint:

Key
results	
string[]

An array of suggested search terms

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* autocomplete */
curl "https://tenor.googleapis.com/v2/autocomplete?key=API_KEY&client_key=my_test_app&q=exc"
Trending Search Terms
Base URL

https://tenor.googleapis.com/v2/trending_terms?<parameters>
Get a JSON object that contains a list of the current trending search terms. Tenor's AI updates the list hourly.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
Display the results in the order provided by the response.
Parameters
The following table provides details on the parameters for the Trending Search Terms endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

limit	
Optional

integer

Fetch up to the specified number of results.

The default value is 20, and the maximum value is 50.

Response format
The following table provides details on the response format for the Trending Search Terms endpoint:

Key
results	
string[]

An array of suggested search terms. The terms are sorted by their Trending Rank.

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* trending Terms call */
curl "https://tenor.googleapis.com/v2/trending_terms?key=API_KEY&client_key=my_test_app"
Register Share
Base URL

https://tenor.googleapis.com/v2/registershare?<parameters>
Register a user's sharing of a GIF or sticker.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
Provide the search term. This helps further tune Tenor's Search Engine AI, which helps users more easily find the perfect GIF or sticker.
Use the locale parameter to enhance the share signal's regional relevancy. The default value is en_US.
Parameters
The following table provides details on the parameters for the Register Share endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

id	
Required

string

The id of a Response Object

Doesn't have a default value.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

country	
Strongly recommended

string (YY)

Specify the country of origin for the request. To do so, provide its two-letter ISO 3166-1 country code.

The default value is US.

locale	
Strongly recommended

string (xx_YY)

Specify the default language to interpret the search string. xx is the language's ISO 639-1 language code, while the optional _YY value is the two-letter ISO 3166-1 country code.

You can use the country code that you provide in locale to differentiate between dialects of the given language.

The default value is en_US.

q	
Strongly recommended

string

The search string that leads to this share.

Doesn't have a default value.

Response format
There's no formal response to the Register Share endpoint. Developers can check the HTTPS response code to determine whether they've successfully reached the API.

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* register share */
curl "https://tenor.googleapis.com/v2/registershare?id=16989471141791455574&key=API_KEY&client_key=my_test_app&q=excited"
Posts
Base URL

https://tenor.googleapis.com/v2/posts?<parameters>
Get the GIFs, stickers, or a combination of the two for the specified IDs.

Best practices
To differentiate your integrations, provide a client_key parameter along with the API's key.
To reduce the number of GIF formats returned, use the media_filter parameter. This can reduce the Response Object size by 75%.
Parameters
The following table provides details on the parameters for the Posts endpoint:

Parameters
key	
Required

string

API key for privileged API access

Doesn't have a default value.

ids	
Required

string

A comma-separated list of Response Object IDs.

Doesn't have a default value, and the maximum value is 50.

client_key	
Strongly recommended

string

A client-specified string that represents the integration.

A client key lets you use the same API key across different integrations but still be able to differentiate them.

For an app integration, use the same client_key value for all API calls.

Any client custom behavior is triggered by the pairing of the key and client_key parameters.

Doesn't have a default value.

media_filter	
Strongly recommended

string

Comma-separated list of GIF formats to filter the Response Objects. By default, media_filter returns all formats for each Response Object.

Example: media_filter=gif,tinygif,mp4,tinymp4

Doesn't have a default value.

Response format
The following table provides details on the response format for the Posts endpoint:

Key
results	
RESPONSE_OBJECT[]

An array of Response Objects that correspond to those passed in the ids list.

Example requests
Curl
Python
Android/Java
Swift 2.0+/iOS
JavaScript
Objective-C

/* Posts endpoint */
curl "https://tenor.googleapis.com/v2/posts?key=API_KEY&client_key=my_test_app&ids=11586094175715197775"
