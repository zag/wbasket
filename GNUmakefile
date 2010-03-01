all:  builds pack_all jars

jars:
	-@env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant jar;
builds:
	-@env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant;
clean:
	env JAVA_HOME=/usr/local/linux-sun-jdk1.6.0 ant $@

war/wset/wset.nocache.js:
		gmake  build
war/wset/wset.nocache.js_: war/wset/wset.nocache.js
	cat war/wset/wbadget.js \
	war/wset/wimho.js \
	war/wset/wset.nocache.js  | perl -I/home/zag/Work/projects/tmp/in_data/packer \
	/home/zag/Work/projects/tmp/in_data/packer/jsPacker.pl -e20 -fq -i -  > $@

war/wset/wset.nocache.js_2: war/wset/wset.nocache.js
	cat war/wset/wbadget.js \
	war/wset/wimho.js \
	war/wset/wset.nocache.js  > $@

war/wset/wimho.nopacked.js:
	cat war/wset/wbadget.js \
	war/wset/wimho.js  > $@

war/wset/wimho.packed.js: war/wset/wimho.nopacked.js
	cat war/wset/wimho.nopacked.js | perl -I/home/zag/Work/projects/tmp/in_data/packer \
	/home/zag/Work/projects/tmp/in_data/packer/jsPacker.pl -e20 -fq -i -  > $@

pack_all: war/wset/wset.nocache.js_2 war/wset/wset.nocache.js_ war/wset/wimho.packed.js
#	-@rm -dRf hosted.html *.css wbadget.js wimho.js wset.nocache.js

#	mv war/wset/wset.nocache.js_ war/wset/wset.nocache.js