#!/bin/bash

pnpm db:update
pnpm build
pm2 restart tecno
