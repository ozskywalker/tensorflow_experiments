#!/bin/sh
docker run --rm --name tensorflow_experiments -dt -p 8888:8888 \
    -e JUPYTER_ENABLE_LAB=yes \
    -v "$(PWD)/notebook_data":/home/jovyan/ \
    jupyter/tensorflow-notebook \
&& docker logs -f tensorflow_experiments
