var JS_HOST="http://connector.imhonet.ru";
var JS_HOST="http://www.learn.zag/tmp/Alert";
var JS_API_PATH = JS_HOST+'/distrib_api';
var JS_PATH="wset/";
function include(_1) {
 for( var j=0;j<_1.length;j++)
    { 
        s='<script src="'+JS_HOST+'/'+JS_PATH+_1[j]+'" type="text/javascript"></script>';
        document.write(s);
    }
}
var imhonet_r = Math.round(Math.random() * 100000);
if ( typeof imhonet == "undefined" ) 
        include(['wbadget.js','wset.nocache.js?random'+ imhonet_r]);

