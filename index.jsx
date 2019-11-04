class Gamelist extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: [{ appid: 0, name: "Loading.." }] }
        this.fetchOnline.bind(this);
    }
    fetchOnline(appid) {
        return new Promise((resolve, reject) => {

            fetch('https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appid, { headers: { 'Origin': 'https://sestudio.keybase.pub/', 'User-agent': 'Fetchbot' } })
                .then(res => res.json())
                .catch(err => {
                    console.error(err);
                    reject();
                })
                .then(data => {
                    resolve(data.response.player_count);
                }).catch(err => {
                    console.error(err);
                    reject();
                });
        })
    }
    comparator(a, b) {
        if (a.appid < b.appid) return -1;
        if (a.appid > b.appid) return 1;
        return 0;
    }
    componentDidMount() {
        fetch('https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/')
            .then(res => res.json())
            .then(data => {
                const nd = data.applist.apps.sort(this.comparator).slice(0, 5000);
                let i = 0
                nd.forEach(el => {
                    i += 1;
                    setTimeout(() => {
                        this.fetchOnline(el.appid).then(pc => {
                            el.online = pc;
                            this.setState({ data: nd });
                        });
                    }, i * 4000)
                });
            }).catch(err => {
                console.error(err);
                alert('An error occured!');
            });
    }
    showOnline(online) {
        if (!online) {
            return "";
        } else {
            if (online == 1) {
                return (<div>{online} player online</div>);
            } else {
                return (<div>{online} players online</div>);
            }
        }
    }
    render() {
        const gmList = this.state.data.map((obj) =>
            <li className="list-group-item" style={{ backgroundColor: '#191c1f' }} key={obj.appid}>{obj.name}
                <span className="badge" style={{ float: 'right', backgroundColor: '#475058', color: 'white' }}>{this.showOnline(obj.online)}</span>
            </li>
        );

        return (
            <ul>
                {gmList}
            </ul>
        );
    }
}

class Nav extends React.Component {
    state = {}
    render() {
        return (
            <div>
                <a className="navbar-brand" href="#">{this.props.title}</a>
            </div>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-light sticky-top">
                {this.props.nav}
                <span className="navbar-text text-secondary justify-content-end">
                    This website is not affiliated with Valve Corporation.
                </span>
            </nav>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="text-light">
                <Header nav={<Nav title="Current Online" />} />
                <Gamelist />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));