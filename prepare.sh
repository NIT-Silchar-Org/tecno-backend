#!/bin/bash
if [[ $NODE_ENV -ne "production" ]]; then
  husky install;
  echo "Hello World"
fi