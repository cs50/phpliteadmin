MAINTAINER = "CS50 <sysadmins@cs50.harvard.edu>"
NAME = phpliteadmin
VERSION = 1.3.1

.PHONY: bash
bash:
	docker build -t phpliteadmin .
	docker run -i --rm -p 8080-8081:8080-8081 -v "$(PWD)":/root -t phpliteadmin

.PHONY: build
build:
	docker build -t pset7 .

.PHONY: clean
clean:
	rm -rf opt $(NAME)_$(VERSION)_*.deb

.PHONY: deb
deb: clean
	mkdir -p opt/cs50/phpliteadmin
	cp -r bin share opt/cs50/phpliteadmin
	chmod -R a+rX opt
	chmod -R a+x opt/cs50/phpliteadmin/bin/*
	fpm \
	-m $(MAINTAINER) \
	-n $(NAME) \
	-s dir \
	-t deb \
	-v $(VERSION) \
	--after-install postinst \
	--deb-no-default-config-files \
	--depends coreutils \
	--depends curl \
	--depends mktemp \
	--depends php5-cli \
	--depends php5-sqlite \
	--depends pwgen \
	opt
