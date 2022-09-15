#!/bin/bash

pnpm db:deploy
pnpm build
pm2 restart tecno
