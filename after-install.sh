#!/bin/bash

# ensure phpliteadmin is executable
chmod -R a+rX /opt/cs50/phpliteadmin
chmod -R a+x /opt/cs50/phpliteadmin/bin/*

# install phpliteadmin in /op/cs50/bin
umask 0022
mkdir -p /opt/cs50/bin
ln -s /opt/cs50/phpliteadmin/bin/phpliteadmin /opt/cs50/bin/phpliteadmin
