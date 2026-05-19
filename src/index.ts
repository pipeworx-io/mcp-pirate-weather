interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Pirate Weather MCP.
 */


const BASE = 'https://api.pirateweather.net';
const UA = 'pipeworx-mcp-pirate-weather/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'forecast',
    description: 'Full forecast at point.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
        time: { type: 'string', description: 'ISO 8601 or epoch seconds for historic.' },
        exclude: { type: 'string' },
        extend: { type: 'string', description: 'hourly' },
        lang: { type: 'string' },
        units: { type: 'string', description: 'us | si | ca | uk | uk2' },
      },
      required: ['lat', 'lon'],
    },
  },
  {
    name: 'forecast_grid',
    description: 'GFS/ECMWF grid forecast.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lon: { type: 'number' },
        time: { type: 'string' },
        units: { type: 'string' },
      },
      required: ['lat', 'lon'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Pirate Weather requires an API key. Set PLATFORM_PIRATEWEATHER_KEY or pass ?_apiKey=… (free at https://pirate-weather.apiable.io).');
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  const lat = reqNum('lat', '40.7128');
  const lon = reqNum('lon', '-74.0060');
  const time = args.time != null ? `,${encodeURIComponent(String(args.time))}` : '';
  const p = new URLSearchParams();
  for (const k of ['exclude', 'extend', 'lang', 'units'] as const) if (args[k]) p.set(k, String(args[k]));
  const path = name === 'forecast_grid' ? '/forecast_grid' : '/forecast';
  const url = `${BASE}${path}/${apiKey}/${lat},${lon}${time}${[...p].length ? `?${p}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 401 || res.status === 403) throw new Error('Pirate Weather: invalid API key.');
  if (!res.ok) throw new Error(`Pirate Weather: ${res.status}`);
  return res.json();
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
