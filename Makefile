MAINTAINER = "CS50 <sysadmins@cs50.harvard.edu>"
NAME = phpliteadmin
VERSION = 1.2.1

.PHONY: bash
bash:
	docker build -t phpliteadmin .
	docker run -i --rm -p 8080:8080 -p 8081:8081 -v "$(PWD)":/root -t phpliteadmin

.PHONY: build
build:
	docker build -t pset7 .

.PHONY: clean
clean:
	rm -f $(NAME)_$(VERSION)_*.deb

.PHONY: deb
deb: clean
	chmod -R a+rX opt
	chmod -R a+x opt/cs50/phpliteadmin/bin/*
	fpm \
	-m $(MAINTAINER) \
	-n $(NAME) \
	-s dir \
	-t deb \
	-v $(VERSION) \
	--after-install after-install.sh \
	--after-remove after-remove.sh \
	--deb-no-default-config-files \
	--depends coreutils \
	--depends curl \
	--depends mktemp \
	--depends php5-cli \
	--depends php5-sqlite \
	--depends pwgen \
	opt
