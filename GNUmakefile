all:  build war/wset/wbadget.js war/wset/inc.js

extra/wbadget.js.packed:
	cat extra/wbadget.js  | perl -I/home/zag/Work/projects/tmp/in_data/packer \
	/home/zag/Work/projects/tmp/in_data/packer/jsPacker.pl -e20 -fq -i -  > $@
war/wset:
	mkdir $@
war/wset/wbadget.js: war/wset extra/wbadget.js.packed
	cp extra/wbadget.js.packed $@
war/wset/inc.js: war/wset
	cp extra/inc.js $@
build:
	-@env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant;
realclean: clean
	-@rm extra/wbadget.js.packed
clean:
	env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant $@


war/wset/wset.nocache.js: build
war/wset/wset.nocache.js_: war/wset/wset.nocache.js
	cat extra/wbadget.js  war/wset/wset.nocache.js  | perl -I/home/zag/Work/projects/tmp/in_data/packer \
	/home/zag/Work/projects/tmp/in_data/packer/jsPacker.pl -e20 -fq -i -  > $@

pack_all: war/wset/wset.nocache.js_