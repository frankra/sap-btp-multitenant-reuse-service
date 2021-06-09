#!/bin/bash
./create-cf-services.sh

(cd product-approuter && cf push)&&
(cd product-webapp && cf push)&&
(cd product-service && cf push)