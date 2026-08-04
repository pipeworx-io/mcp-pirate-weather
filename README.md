# @pipeworx/pirate-weather

[Pirate Weather](https://pirate-weather.apiable.io/) MCP — Dark Sky-compatible forecast API. Free key required (10k/mo).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_PIRATEWEATHER_KEY`. BYO: `?_apiKey=…`.

## Tools

- `forecast(lat, lon, time?, exclude?, extend?, lang?, units?)` — full forecast at point
- `forecast_grid(lat, lon, time?, units?)` — GFS/ECMWF grid output

`exclude`: comma-sep `currently,minutely,hourly,daily,alerts`. `extend=hourly` returns 168h. `units`: `us` (default) | `si` | `ca` | `uk` | `uk2`.

## Data source

`https://api.pirateweather.net`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "pirate-weather": {
      "url": "https://gateway.pipeworx.io/pirate-weather/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Pirate Weather data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
