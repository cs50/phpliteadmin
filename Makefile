MAINTAINER = "CS50 <sysadmins@cs50.harvard.edu>"
NAME = phpliteadmin
VERSION = 1.2.1

.PHONY: bash
bash:
	docker build -t phpliteadmin .
	docker run -i --rm -p 8080-8081:8080-8081 -v "$(PWD)":/root -t phpliteadmin

.PHONY: build
build:
	docker build -t pset7 .

.PHONY: clean
clean:
	rm -f opt/cs50/bin/phpliteadmin
	rmdir --ignore-fail-on-non-empty -p opt/cs50/bin/ &>/dev/null
	rm -f $(NAME)_$(VERSION)_*.deb

.PHONY: deb
deb: clean
	mkdir -p opt/cs50/bin/
	ln -s /opt/cs50/phpliteadmin/bin/phpliteadmin -t opt/cs50/bin/
	chmod -R a+rX opt
	chmod -R a+x opt/cs50/phpliteadmin/bin/*
	fpm \
	-m $(MAINTAINER) \
	-n $(NAME) \
	-s dir \
	-t deb \
	-v $(VERSION) \
	--deb-no-default-config-files \
	--depends coreutils \
	--depends curl \
	--depends mktemp \
	--depends php5-cli \
	--depends php5-sqlite \
	--depends pwgen \
	opt
