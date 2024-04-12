# Snowplow Micro

## Prerequisites

1. NodeJS 16
2. Git
3. Docker 

## Setup Tracker

### 1. Install the dependencies

```bash
npm install
```

### 2. Update the environment files

#### Local Deployment

Update the `snowplowCollectorURL` field value in `src/environments.ts` file.

#### Production Deployment

Update the `snowplowCollectorURL` field value in `src/environments.prod.ts` file.

```typescript
export const environment = {
  production: false,
  snowplowCollectorURL: 'localhost:9090'
};
```

## Setup Snowplow Micro

Open your terminal and execute. This will start your snowplow-micro instance on localhost:9090

```bash
docker run -it --rm --name snowplow-micro -p 9090:9090 snowplow/snowplow-micro:2.1.0
```

## Serve the application

Open another terminal in the cloned repo directory and execute

```bash
npm run start
```

Your application will be served on `http://localhost:4200`

## View Snowplow Dashboard

Open `http://localhost:9090/micro/ui` to view your snowplow micro dashboard.

## Snaphots

### Application with tracker request details

![app](./__assets__/Screenshot%202024-04-13%20at%2012.05.00%20AM.png)

### Snowplow Event Stream

![a](./__assets__/Screenshot%202024-04-13%20at%2012.05.31%20AM.png)

### Snowplow Event Table

![b](./__assets__/Screenshot%202024-04-13%20at%2012.05.48%20AM.png)