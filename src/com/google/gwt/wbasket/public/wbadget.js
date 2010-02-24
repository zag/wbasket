/*
 * WBasket
 *
 * Copyright (C) 2009 Zahatski Aliaksnadr
 *
*
 */

if (window.WBasket === undefined) {
    window.WBasket   = {};
}
var __WBasket_JS_INCLUDED;
if ( ! __WBasket_JS_INCLUDED ) {
    __WBasket_JS_INCLUDED = true;



    /*---------------------------WBasket Package--------------------------------*/
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
        //Permite aсadir o eliminar tiempo del contador final mientras se esta contando
        this.addTime = function (tiempo) {
            if (iniciado) {
                //Para que al resultado final se le aсada x tiemp, hay que restarselo al valor inicial.
                startTime = startTime - tiempo;
            }
        };

        //Constructor
        if (iniciar) {
            this.start();
        }

    };


    WBasket.extend = function() {
	// copy reference to target object
	var target = arguments[0], a = 1;

	// extend WBasket itself if only one argument is passed
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

( function ($) {

  $.extend({
/* INIT VARS */

    loadedModules  : [],
    pendingCreates : [],
    metaProps : {},

    log : new LogFirebug( 0 ),

    /* WBasket Helper functions */

	// This may seem like some crazy code, but trust me when I say that this
	// is the only cross-browser way to do this. --John
    isFunction : function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName && 
			fn.constructor != Array && /function/i.test( fn + "" );
	},

    goTo : function goTo(url) {
        location.replace(url);
    },

    concat : function () {
        var i;
        var r;
        r = "";
        for (i = 0; i < arguments.length; i++) {
            r += arguments[i];
        }
        return r;
    },

    $ : function () {
        return '+';
    },

    Widget : function (className, container) {
        this.instance  = null;
        this.className = className;
        this.container = container;
    },
    create : function (widget, moduleName, container, params, createTimer) {
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
        //Toma de tiempo de creaciуn de widget
//        GWanted.TimeLogger.getInstance().addWidgetCreateTime(createTimer,widgetName);
    },
    makeWidgetNest : function (moduleName, params, containerName) {
        this.log.warn('create widget' + moduleName);
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
        //Toma de medida para tiempo de creaciуn de widget.
        var timer = new LogTimer(true);

        var widget                  = new this.Widget(moduleName, container);
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
    },
     isModuleLoaded : function () { return false},

     onWBasket : function () {
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
    },
     createJSAttributes : function (element) {
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
    },

    processMetas : function () {
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
    },

    getMetaProperty : function (name) {
        var value = this.metaProps[name];
        if (value) {
            return value;
        } else {
            return null;
        }
    },

    setMetaProperty : function (name, value) {
        this.metaProps[name] = value;
    }



        });//$.extend

})(WBasket);


    /* Run */
/*    (function(){
            WBasket.processMetas();

	    if (WBasket) {
	    var windowOnload = window.onload;
	    window.onload    = function () {
	      try {
		    var widget;
                    WBasket.log.info("run window.onload");
		    while (WBasket.pendingCreates.length > 0) {
		      widget = WBasket.pendingCreates.pop();
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
*/
}




