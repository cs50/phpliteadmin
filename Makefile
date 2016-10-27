MAINTAINER = "CS50 <sysadmins@cs50.harvard.edu>"
NAME = phpliteadmin
VERSION = 1.0.0

.PHONY: bash
bash:
	docker build -t phpliteadmin .
	docker run -i --rm -v "$(PWD)":/root -t phpliteadmin

.PHONY: build
build:
	docker build -t pset7 .

.PHONY: clean
clean:
	rm -f $(NAME)_$(VERSION)_*.deb

.PHONY: deb
deb:
	rm -f $(NAME)_$(VERSION)_*.deb
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
	--depends pwgen \
	opt
