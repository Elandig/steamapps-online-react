# Steam Apps Current Online
Simple React.js example that shows current Steam apps online

# Demo
Will be available soon!

# Usage

For local development you can use [http-server](https://github.com/http-party/http-server) to serve the content.
Also, you will need your own API to work with the Steam API because of the CORS Policy.
Or you can just avoid it by using [cors-anywhere](https://github.com/Rob--W/cors-anywhere)
i.e:
1. ```https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/```
2. ```https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/```

* To change API destination, go to [app.jsx(Line 36)](https://github.com/Elandig/steamapps-online-react/blob/master/app.jsx#L36)
```js
const destination_urls =
{
    GetAppList: "https://api.example.com/GetAppList", // Must return https://api.steampowered.com/ISteamApps/GetAppList/v2/
    GetNumberOfCurrentPlayers: "https://api.example.com/GetNumberOfCurrentPlayers", // Must return https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/
    Origin: "https://example.com" // Origin domain name (Not necessary.)
}
```

* To change the rate limit interval, go to [app.jsx(Line 43)](https://github.com/Elandig/steamapps-online-react/blob/master/app.jsx#L43)
```js
const rate_limit_interval = 4000 // Rate limit interval (ms)
```

* To reduce amount of the shown apps, change the value at [app.jsx(Line 52)](https://github.com/Elandig/steamapps-online-react/blob/master/app.jsx#L52)
```js
/*
Limit amount of the shown apps.
Use undefined to remove the limit (Not recommended.)

OR you can set your own query string to limit the amount of the shown apps server-side
i.e: https://api.example.com/GetAppList?amount=1000
*/
const game_list_limit = 1000
```

# API
Will be available soon!
