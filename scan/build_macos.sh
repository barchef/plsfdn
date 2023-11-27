#!/bin/bash

apt-get update && \
apt-get install -y zip && \
mkdir -p build/macos && \
cp -R macos/* build/macos/ && \
cp -R pkg/app/dist build/macos && \
cd build/macos/ && \
zip -r ../MacOS.zip ./*
