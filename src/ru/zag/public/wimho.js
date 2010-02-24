//SET OF IMHONET DATA

if (window.wimho === undefined) {
    window.wimho   = {};
    if (typeof JS_HOST == "undefined" ) {
        JS_HOST="http://connector.imhonet.ru"
    }
    if (typeof JS_API_PATH == "undefined" ) {
        JS_API_PATH=JS_HOST+'/distrib_api'
    }
    if ( typeof imhonet_r == "undefined") {
    imhonet_r = Math.round(Math.random() * 100000);
    }

}
if (window.wimho.commonUrl === undefined) {
    wimho.commonUrl    = '';
}

var __WIMHO_JS_INCLUDED;

if (! __WIMHO_JS_INCLUDED) {
    __WIMHO_JS_INCLUDED = true;

( function ($) {

    $.extend(
    wimho, {
    log : new LogFirebug( 0 ),
    get_rate_init_url : function (attr, params) {
    //"http://connector.imhonet.ru/distrib_api/50bbeadaa17f02e1fdf9f216af1e79b6/1210753367/37427125/1410/w_rate.json?on_get_rate=1&keywords=85174";
        attr.method="w_rate.json";
        var pars = this.get_defs();
        if (! params) {
            params = {};}
        if (  pars.encode != 'utf8' ) {
            params.encode = pars.encode;}
        if ( ! pars.rate_custom_p ) {
            params.nodefs_rate = 1;}
       if (attr.on_get_rate && $.isFunction(attr.on_get_rate))  {
	$.extend(params,{"on_get_rate": 1});}
	    
	params.keywords = imhonet_r;
        var url = this.get_req_url(attr, params);
        return url;

    },
        get_post_url : function ( attr , value ) {
        attr.method="edit_rate.json";
	
	var params = {};
	params.keywords = imhonet_r;
	params.value = value;
	if (attr["content"]) { 
	    params.toid = attr["content"];}
        var url = this.get_req_url( attr , params);
        this.log.warn("POST URL URL"+ url);
        return url;
    },

        get_req_url : function (attr,params) {
	var reg = /[\s,\?,\/]+/g;
	var defaults = {soid: 0, ssid:0, sign:0, cid:0 };
	for (var k in defaults) {
	    if (attr[k]) {
		if(reg.test(attr[k])) {
		    params[k] = attr[k];
		}else{
		    defaults[k] = attr[k];
		}
	    } 
	}
        //$_.extend ( defaults, attr);
        // fill extra params to url
        var s = [];
        // Serialize the key/values
	for ( var j in params ) {
	    if ( !(j == "value" && params[j] == "_none") )
	    	s.push( encodeURIComponent(j) + "=" + encodeURIComponent( params[j] ) );
	}
        //var cgi_pars = s.join("&").replace(/%20/g, "+");
        var cgi_pars = s.join("&");
        var url = [JS_API_PATH,defaults.sign, defaults.cid,defaults.ssid, defaults.soid, attr.method ].join("/");
        if (cgi_pars) 
            url +='?'+cgi_pars;
        return url;
    },
    get_defs : function() {
        var defs = {
            imhonet_rate_bstars : JS_HOST+'/img/star.gif',
            imhonet_rate_sstars : JS_HOST+'/img/star_small.gif',
            imhonet_rate_bnull : JS_HOST+'/img/b_rate_null.gif',
            imhonet_rate_snull : JS_HOST+'/img/rate_null.gif',
	    imhonet_rate_bactivity : JS_HOST+'/img/ajax_activity_b.gif',
            imhonet_rate_sactivity : JS_HOST+'/img/ajax_activity_s.gif',
	    imhonet_rate_berror : JS_HOST+'/img/ajax_error_b.gif',
            imhonet_rate_serror : JS_HOST+'/img/ajax_error_s.gif',
            encode : 'utf8',
            rate_custom : [[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10]]
        };
        var cust = {};
        if (window.imhonet_rate_bstars)
            cust.imhonet_rate_bstars = window.imhonet_rate_bstars ;
        if (window.imhonet_rate_sstars)
            cust.imhonet_rate_sstars = window.imhonet_rate_sstars ;
        if (window.imhonet_rate_bnull)
            cust.imhonet_rate_bnull = window.imhonet_rate_bnull ;
        if (window.imhonet_rate_snull)
            cust.imhonet_rate_snull = window.imhonet_rate_snull ;
	if (window.imhonet_rate_bactivity)
            cust.imhonet_rate_bactivity = window.imhonet_rate_bactivity ;
        if (window.imhonet_rate_sactivity)
            cust.imhonet_rate_sactivity = window.imhonet_rate_sactivity ;
        if ( window.imhonet_1251) 
            cust.encode = '1251';
        if ( window.imhonet_koi8) 
            cust.encode = 'koi8-r';
        if ( window.imhonet_rate_custom ) {
            cust.rate_custom = window.imhonet_rate_custom;
            cust.rate_custom_p = 1;
        }
        $.extend( defs, cust);
        return defs;
    },

    actual_rate_scale : function(scale ) {
        var pr = scale || wimho.get_defs().rate_custom;
        var actual_scale = [];
        var num=0;
        for (i = 0; i < pr.length ; i++)  {
            var str = pr[i][0] ;
            if ( str && ( typeof str == "number" || str.match(/[-\d]+/) ) )   { actual_scale.push(pr[i])}
        }
        return actual_scale;

    },
    idx2rate : function  ( idx ) {
        var pr =  wimho.get_defs().rate_custom;
        if ( idx > 0 ) {
            pr = wimho.actual_rate_scale(pr);
            idx--;
        }
        var value = pr[idx][0];
        var text =  pr[idx][1];
        return { 'value': value, 'text': text };
    },

    rate2idx : function ( value) {
        var pr = wimho.actual_rate_scale(wimho.get_defs().rate_custom);
        var idx = 0;
        for (i = 0; i < pr.length ; i++) {
            var rvalue = pr[i][0];
            if ( value == rvalue) {
                idx = i+1;
                break;
            }
        }
        wimho.log.info("return idx:"+ idx+ " for rate " + value );
        return idx;
    }


    }); //WBasket.extend
})(WBasket);


function imhonet_rate_print (params, container) {
//        wimho.log.info("b:imhonet_rate_print");
        WBasket.makeWidgetNest('Popup', params, container);
//        wimho.log.info('end:imhonet_rate_print')
    }

}  //__WIMHO_JS_INCLUDED

