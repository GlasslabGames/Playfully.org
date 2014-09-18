#!/bin/bash

npm install
bower install --allow-root --config.interactive=false

# export HYDRA_ENV="stage"

if [ "$HYDRA_ENV" = "dev" ]
then
    echo "Builing..."
    grunt build
else
    echo "Compiling..."
    grunt compile
fi
