#!/bin/bash

npm install
bower install --allow-root --config.interactive=false

if [ "$HYDRA_ENV" = "dev" ]
then
    grunt build
else
    grunt compile
fi
