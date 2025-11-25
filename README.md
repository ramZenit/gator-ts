# Welcome to GATOR (TypeScript version)

A backend project for the boot.dev curriculum

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (look at .nvmrc for the required version)
- **PostgreSQL** (with a db named 'gator')

## Installation

1. Clone the repo:

``` bash
git clone "https://github.com/ramZenit/gator-ts.git"
```

2. Install dependencies:

``` bash
npm install
```

3. Create a config file at ~/.gatorconfig.json, use this structure:

``` json
{
  "db_url": "postgres://USERNAME:PASSWORD@SERVER:PORT/gator?sslmode=disable"
}
```

4. Migrate the database to latest version

``` bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Avaiable Commands

Run a command with:

``` bash
npm start <command> [args...]
```

### User

- `register <username>` : Register a new username
- `login <username>` : Switch to username
- `users` : lists all users

### Feed

- `addfeed <feed-name> <url>` : Add a new RSS feed
- `follow <url>` : Follow a RSS feed
- `unfollow <url>` : Unfollow a RSS feed
- `feeds` : List of all added feeds
- `following` : List of all feed you follow

### Aggregator

- `agg <interval>` : Fetch new posts from all feed at an interval ( 10s | 5m | 1h )
- `browse [limit]` : Browse posts from followed feed

### Other

- `reset` : Reset the database
