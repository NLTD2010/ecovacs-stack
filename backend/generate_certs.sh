#!/bin/ash
set -e

if [ ! -f ./ssl.crt ]; then
	echo "Generate Certificates" 

  BASE_URLS=$(env | grep -P "^BASE_URL(_\d\d)?\=")
  for base_url in $BASE_URLS; do
    domain=$(echo $base_url | cut -d "=" -f 2)
  echo here $domain
    echo "127.0.0.1 ${domain:8}" | sudo tee -a /etc/hosts
    domains_list="$domains_list ${domain:8}"
  done

  rm -f ./ssl.crt ./ssl.key
  mkcert -cert-file  ./ssl.crt -key-file  ./ssl.key $domains_list
  mkcert -install
  export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
fi