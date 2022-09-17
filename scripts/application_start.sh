#!/bin/bash

pnpm install
pnpm db:deploy
pnpm build
pm2 restart tecno
