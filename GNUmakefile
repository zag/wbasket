all:  build

build:
	env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant; \
	cat extra/wbadget.js  | perl -I/home/zag/Work/projects/tmp/in_data/packer \
	/home/zag/Work/projects/tmp/in_data/packer/jsPacker.pl -e20 -fq -i -  > war/wset/wbadget.js
buildfile:
	env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant -buildfile build.xml.old
% :
	env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant $@