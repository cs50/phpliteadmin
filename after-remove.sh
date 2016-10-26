#!/bin/bash

# remove /opt/cs50/bin/phpliteadmin and any empty parents
rm -f /opt/cs50/bin/phpliteadmin
rmdir --ignore-fail-on-non-empty -p /opt/cs50/bin
