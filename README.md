# bwitch

A tiny weeny pattern matcher with zero dependencies. Requires TypeScript 5.0+

## Install

```bash
yarn add bwitch
```

## Usage

```typescript
const page = 'home';

const route = bwitch(page)
	.case('home', () => '/api/home/timeline')
	.case('weather', () => '/api/v1/weather/forecast')
	.orThrow();

route; // => `"/api/home/timeline" | "/api/v1/weather/forecast"`
```

Alternatively, you can finish a bwitch with a default case, or a helper to default to null

```typescript
const page = 'home';

// Specify default
const route = bwitch(page)
	.case('home', () => '/api/home/timeline')
	// ...
	.or(value => '/api/home/timeline');

// Default to null
// This is the same as doing `.or(() => null)`
const route = bwitch(page)
	.case('home', () => '/api/home/timeline')
	// ...
	.orNull();
```
