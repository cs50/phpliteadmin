```
$ grep -v "^$" script.js | grep -v "\/\/.*" | sed -e "s/^/echo '/g" -e "s/$/';/g"
```
