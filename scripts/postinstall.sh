#!/bin/bash
if [[ $NODE_ENV -ne "production" ]]; then
  pnpm db:update;
fi
