/*
MIT License

Copyright (c) 2019 Elan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


/*
Destination URLs for your API

For development/testing you can try https://github.com/Rob--W/cors-anywhere to avoid CORS policy
i.e:
- https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/
- https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/

Also, https://github.com/http-party/http-server for serving the content
*/
const destination_urls =
{
    GetAppList: "https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/", // https://api.steampowered.com/ISteamApps/GetAppList/v2/ (Could be outdated)
    GetNumberOfCurrentPlayers: "https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/", // https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/ (Could be outdated)
    Origin: "https://elandig.github.io" // Origin domain name
}

const rate_limit_interval = 10000 // Rate limit interval (ms)

/*
Limit amount of the shown apps.
Use undefined to remove the limit (Not recommended.)

OR you can set your own query string to limit the amount of the shown apps server-side
i.e: https://api.example.com/GetAppList?amount=1000
*/
const game_list_limit = 20

class Gamelist extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state =
        {
            data:
            [
                { appid: 0, name: "Loading.." }, // Initial object in the game list (will be overwritten)
            ]
        }
        this.fetchData.bind(this);
    }

    // Fetch data from the API destinations entered in destination_urls
    fetchData(appid)
    {
        return new Promise((resolve, reject) =>
        {
            fetch(`${destination_urls.GetNumberOfCurrentPlayers}?appid=${appid}`, { headers: { 'Origin': destination_urls.Origin, 'User-agent': 'Fetch-client' } })
                .then(res => res.json()).catch(err => reject(err))
                .then(data => resolve(data.response.player_count)).catch(err => reject(err));
        })
    }

    // Comparator for sorting apps by their appid value
    comparator(a, b)
    {
        if (a.appid < b.appid) return -1;
        if (a.appid > b.appid) return 1;
        return 0;
    }

    componentDidMount()
    {
        fetch(destination_urls.GetAppList).then(res => res.json())
            .then(data => {
                const _data = data.applist.apps.sort(this.comparator) // Sort by appid value using comparator
                .slice(0, game_list_limit); // Limit amount of shown apps
                this.setState({ data: _data });
                // Loop with rate limit interval
                let i = 0;
                _data.forEach(el => {
                    setTimeout(() => {
                        // Fetch data from the API
                        this.fetchData(el.appid).then(appdata => {
                            el.online = appdata;
                            this.setState({ data: _data });
                        }).catch(err => console.error(err));
                    },
                    i * rate_limit_interval
                    );
                    i += 1;
                });
            }).catch(err => console.error(err));
    }

    // Format string for current online label
    processString(online)
    {
        if (!online) {return ""}
        else
        {
            if (online == 1)
                return (<div>{online} player online</div>);
            else
            {
                if (online >= 1000000) {
                    return (<div>{(online/1000000).toFixed(2)}mil players online</div>);
                }
                else if (online >= 1000) {
                    return (<div>{(online/1000).toFixed(2)}k players online</div>);
                }
                else {
                    return (<div>{online} players online</div>);
                }
            }
                
        }
    }

    render()
    {
        // App list objects rendering
        const appList = this.state.data.map((obj) =>
            <li className="gamelist list-group-item" key={obj.appid}>
                <div className="gamelist-obj-title">{obj.name}</div>
                <span className="gamelist-obj-online badge">{this.processString(obj.online)}</span>
            </li>
        );

        return (
            <ul>
                {appList}
            </ul>
        );
    }
}

class Header extends React.Component
{
    render()
    {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-light sticky-top">
                <div>
                    <a className="navbar-brand" href="#">Current Online</a>
                </div>
                <span className="navbar-text text-secondary justify-content-end">
                    This website is not affiliated with Valve Corporation.
                </span>
                <div style={{ marginTop: '1em' }} className="alert alert-info"><strong>Note:</strong> It might take a while to load current player online for each app (1 request each 10 seconds.)</div>
            </nav>
        );
    }
}

class App extends React.Component
{
    render()
    {
        return (
            <div className="text-light">
                <Header />
                <Gamelist />
            </div>
        );
    }
}

// Render the result
ReactDOM.render(<App />, document.getElementById('root'));
