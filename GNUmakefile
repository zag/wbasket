all:  build war/wset/wbadget.js war/wset/inc.js

extra/badget.js.packed:
	cat extra/wbadget.js  | perl -I/home/zag/Work/projects/tmp/in_data/packer \
	/home/zag/Work/projects/tmp/in_data/packer/jsPacker.pl -e20 -fq -i -  > $@
war/wset:
	mkdir $@
war/wset/wbadget.js: war/wset extra/badget.js.packed
	cp extra/badget.js.packed $@
war/wset/inc.js: war/wset
	cp extra/inc.js $@
build:
	-@env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant;
clean:
	env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant $@