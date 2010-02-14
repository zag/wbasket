/*
 * wbadget
 *
 * Copyright (C) 2007 Zahatski Aliaksnadr
 *
*
 */
if (window.GWanted === undefined) {
    window.GWanted   = {};
}

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




    /*---------------------------GWanted Package--------------------------------*/
    /*
        0 - no debug
        1 - critic 
        2 - warn
        3 - info
    */
    LogFirebug = function ( inlevel) {
        var loglevel = 0;
        this.message = function (message,level) {
            if ( this.loglevel >= level ) {
            console.warn(message)
            }
        };
        this.critic = function( message) {this.message(message,1) };
        this.warn = function( message) {this.message(message,2) };
        this.info = function( message) {this.message(message,2) };

        if( typeof console != "undefined" && inlevel ) {
            this.loglevel = inlevel
        }
    };

    /**
     * Time Counter class
     */
    LogTimer = function (iniciar) {
        var startTime = 0;
        var iniciado = false;

        this.start = function () {
            if (!iniciado) {
                startTime = new Date().getTime();
                iniciado = true;
            } else {
                //TODO excepcion?
            }
        };

        this.stop = function () {
            if (iniciado) {
                iniciado = false;
                return (new Date().getTime()) - startTime;
            } else {
                return 0;
            }
        };
        //Permite añadir o eliminar tiempo del contador final mientras se esta contando
        this.addTime = function (tiempo) {
            if (iniciado) {
                //Para que al resultado final se le añada x tiemp, hay que restarselo al valor inicial.
                startTime = startTime - tiempo;
            }
        };

        //Constructor
        if (iniciar) {
            this.start();
        }

    };

//    GWanted.__GWANTED_JS_LOAD_START_TIME = new LogTimer(true);
    wimho.log = new LogFirebug( 2 );
//    GWanted.Version = '0.0.4';
    
    wimho.loadedModules  = [];
    wimho.pendingCreates = [];


    wimho.createJSAttributes = function (element) {
        var i;
        var attribute;

        for (i = 0; i < element.attributes.length; i++) {
            attribute = element.attributes[i];
            if (attribute.specified) {
                if (attribute.nodeName !== "style") {
                    element[attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
    };

    wimho.metaProps = {};

    wimho.processMetas = function () {
        var metas = document.getElementsByTagName("meta");
        var meta, name, value, content, eq;
        for (var i = 0, n = metas.length; i < n; ++i) {
            meta = metas[i];
            name = meta.getAttribute("name");
            if (name) {
                if (name === "wimho:property") {
                    content = meta.getAttribute("content");
                    if (content) {
                        name = content;
                        value = "";
                        eq = content.indexOf("=");
                        if (eq !== -1) {
                            name = content.substring(0, eq);
                            value = content.substring(eq + 1);
                        }
                        this.metaProps[name] = value;
                    }
                }
            }
        }
    };

    wimho.getMetaProperty = function (name) {
        var value = this.metaProps[name];
        if (value) {
            return value;
        } else {
            return null;
        }
    };

    wimho.setMetaProperty = function (name, value) {
        this.metaProps[name] = value;
    };

    wimho.processMetas();

    /* wimho Helper functions */

    wimho.goTo = function goTo(url) {
        location.replace(url);
    };

    wimho.concat = function () {
        var i;
        var r;
        r = "";
        for (i = 0; i < arguments.length; i++) {
            r += arguments[i];
        }
        return r;
    };

    wimho.extend = function() {
	// copy reference to target object
	var target = arguments[0], a = 1;

	// extend jQuery itself if only one argument is passed
	if ( arguments.length == 1 ) {
		target = this;
		a = 0;
	}
	var prop;
	while ( (prop = arguments[a++]) != null )
		// Extend the base object
		for ( var i in prop ) target[i] = prop[i];

	// Return the modified object
	return target;
    };
	// This may seem like some crazy code, but trust me when I say that this
	// is the only cross-browser way to do this. --John
    wimho.isFunction=function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName && 
			fn.constructor != Array && /function/i.test( fn + "" );
	};

    wimho.$ = function () {
        return '+';
    };
    wimho.get_defs = function() {
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
        wimho.extend( defs, cust);
        return defs;
    };

    wimho.actual_rate_scale = function(scale ) {
        var pr = scale || wimho.get_defs().rate_custom;
        var actual_scale = [];
        var num=0;
        for (i = 0; i < pr.length ; i++)  {
            var str = pr[i][0] ;
            if ( str && ( typeof str == "number" || str.match(/[-\d]+/) ) )   { actual_scale.push(pr[i])}
        }
        return actual_scale;

    };
    wimho.idx2rate = function  ( idx ) {
        var pr =  wimho.get_defs().rate_custom;
        if ( idx > 0 ) {
            pr = wimho.actual_rate_scale(pr);
            idx--;
        }
        var value = pr[idx][0];
        var text =  pr[idx][1];
        return { 'value': value, 'text': text };
    };

    wimho.rate2idx = function ( value) {
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
    };


    /* Run */
    (function(){

	    if (wimho) {
	    var windowOnload = window.onload;
	    window.onload    = function () {
	      try {
		    var widget;
                    wimho.log.info("run window.onload");
		    while (wimho.pendingCreates.length > 0) {
		      widget = wimho.pendingCreates.pop();
		      if (widget) {
		        widget.container.innerHTML = widget.container.accessibleHTML;
		      }
		    }
	      } finally {
	        if (typeof windowOnload == 'function') {
			  windowOnload();
			}
		  }
	    }
        }
	 })();


    wimho.Widget = function (className, container) {
        this.instance  = null;
        this.className = className;
        this.container = container;
    };

    wimho.isModuleLoaded=function () { return false};
    wimho.onWBasket1= function () {
            this.log.info("onWBasket")
    };

    wimho.onWBasket = function () {
         this.log.info("onWBasket");
        var pendingCreate;
        var i = 0;
        this.log.info('Pending count: '+this.pendingCreates.length);
        while (i < this.pendingCreates.length) {
            pendingCreate = this.pendingCreates[i];

            if (pendingCreate.moduleName ) {
                try {
                    pendingCreate.callback.call(
                                            this,
                                            pendingCreate.widget,
                                            pendingCreate.moduleName,
                                            pendingCreate.container,
                                            pendingCreate.params,
                                            pendingCreate.createTimer);
                } catch (ex) {
                    /*TODO: Lo ignoramos?, lo mostramos en la barra de estado?*/
                    this.log.critic("Error creating widget " +
                                          "of the module " + pendingCreate.moduleName);
                }

                this.pendingCreates = this.pendingCreates.slice(0, i).
                                         concat(this.pendingCreates.slice(i + 1));
            } else {
                i++;
            }
        }
    };

    wimho.create = function (widget, moduleName, container, params, createTimer) {
        var instance, elem;
        try {
            if (container.gwanted) {
                this.log.critic("Container " + container.id + " already has a widget"+
                              "onModuleLoad");
            }
            if (widget.instance) {
                /*TODO: Lo ignoramos?, lo mostramos en la barra de estado?*/
                this.log.critic("Widget already loaded"+ "onModuleLoad");
            }
            try {
                this.log.info('try eval widget');
//                instance = eval("new WBasket." + moduleName +
//                                    "(container, params, container.accessibleHTML);");
            this.log.info("make widget at"+ container.getAttribute("id"));
//                instance = eval("new WBasket." + moduleName +"('"+container.getAttribute("id")+"',params);");

                instance = eval("new WBasket." + moduleName +"(container,params);");
                 this.log.info('try eval widget:ok');
                widget.instance = instance;

                //To map all public methods and events to the container
                container.gwanted = {};
                for (elem in instance) {
                    if (typeof instance[elem] === 'function') {
//                        GWanted.addLogger(instance,elem,widgetName);
                    }
                    container.gwanted[elem] = instance[elem];
                }

                for (elem in widget) {
                    if (typeof widget[elem] === 'function') {
//                        GWanted.addLogger(widget,elem,widgetName);
                        container.gwanted[elem] = widget[elem];
                    }
                }

                if (widget.instance.java_obj) {
                    this.log.info('!!!! fireOnCreate');
                    widget.fireOnCreate();
                    /*TODO: See as retrieve an throw the exceptions*/
                }
            } catch (ex0) {
                this.log.critic("The class " + moduleName + " constructor "  +
                                  "throw an exception.");
            }
        } catch (ex1) {
            this.log.warn(" unknown catch");
            widget.fireOnError(ex1);
        } finally {
                    this.log.warn("finnaly");
//            GWanted.TimeLogger.getInstance().currentWidgetName = null;
        }
        //Toma de tiempo de creación de widget
//        GWanted.TimeLogger.getInstance().addWidgetCreateTime(createTimer,widgetName);
    };


    wimho.makeWidgetNest = function (moduleName, params, containerName) {
        wimho.log.warn('create widget' + moduleName);
        if (! moduleName) {
            this.log.critic("To create a widget you must pass in the " +
                            "second parameter the GWT module name");
        }

        var container;

        if (typeof containerName === "string") {
            if (containerName === "") {
                containerName = 'id' + Math.random();
                containerName = containerName.replace('.','');
            }
            container = document.getElementById(containerName);
            if (! container)  {
                document.write('<span id="' + containerName + '"></span>');
                container = document.getElementById(containerName);
            }
        } else {
            container = containerName;
            containerName = container.getAttribute("name");
        }
        //Toma de medida para tiempo de creación de widget.
        var timer = new LogTimer(true);

        var widget                  = new wimho.Widget(moduleName, container);
        container.__gwanted         = {};
        container.__gwanted.widget  = widget;
/*
        for (var property in events) {
            widget[property] = events[property];
        }
    */
        this.log.warn('isload ' + moduleName + '?');
        if (this.isModuleLoaded(moduleName)) {
            this.create(widget, className, container, params,timer);
        } else {
           this.log.warn('pending widget ' + moduleName + '!');
            this.pendingCreates.push(
                {
                moduleName    : moduleName,
                widget        : widget,
                container     : container,
                params        : params,
                callback      : this.create,
                createTimer   : timer
            }
            );
        }
    };

wimho.extend(
    wimho, {
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
       if (attr.on_get_rate && wimho.isFunction(attr.on_get_rate))  {
	wimho.extend(params,{"on_get_rate": 1});}
	    
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
    }

    });
    function imhonet_rate_print (params, container) {
        wimho.log.info("b:imhonet_rate_print");
        wimho.makeWidgetNest('Popup', params, container);
        wimho.log.info('end:imhonet_rate_print')
    }
}  //__WIMHO_JS_INCLUDED
