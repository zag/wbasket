/*
 * GWanted
 *
 * Copyright (C) 2007 Bankinter
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 */
if (window.GWanted === undefined) {
    window.GWanted   = {};
}
if (window.GWanted.commonUrl === undefined) {
    GWanted.commonUrl    = '';
}

var __GWANTED_JS_INCLUDED;

if (! __GWANTED_JS_INCLUDED) {
    __GWANTED_JS_INCLUDED = true;

    /*---------------------------GWanted Package--------------------------------*/

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

    GWanted.__GWANTED_JS_LOAD_START_TIME = new LogTimer(true);
    GWanted.Version = '0.0.4';

    /*---------------------------ServerLogs Class-------------------------------*/
    GWanted.ServerLogSink = function (serverLogUrl) {
        /* Debe ser un objeto global para que no se cancela la descarga al salir
         * de ambito la imagen..
         * Damos preferencia al usuario frente a los logs
         * Se pueden perder peticiones en de dos excepciones muy proximas.
         * Tambien se pierden las peticiones si el usuario cambia de pagina.
         * En mozilla se ve q esta descargando una imagen de forma asincrona.
         */
        this.image        = new Image();
        this.serverLogUrl = serverLogUrl;
    };

    GWanted.ServerLogSink.prototype.sendException = function (error, isUncatch) {
        var message;
        if (this.serverLogUrl) {
            message = this.createExceptionMessage(error,isUncatch);
            this.sendGet(this.serverLogUrl, message);
        }
    };

    GWanted.ServerLogSink.prototype.createExceptionMessage = function (error,
                                                                  isUncatch) {
        var message = {};
        var fields  = [  "navigator.appCodeName",     "nc",
                     "navigator.appMinorVersion", "nam",
                     "navigator.appName",         "nan",
                     "navigator.appVersion",      "nav",
                     "navigator.browserLanguage", "nl",  /*IE*/
                     "navigator.language",        "nl",  /*FireFox*/
                     "navigator.cookieEnabled",   "nce",
                     "navigator.cpuClass",        "ncc", /*IE*/
                     "navigator.oscpu",           "ncc", /*FireFox*/
                     "navigator.onLine",          "nol",
                     "navigator.platform",        "npl",
                     "navigator.userAgent",       "nua",
                     "navigator.javaEnabled()",   "nje",
                     "navigator.taintEnabled()",  "nte",
                     "location.href",             "lhr",
                     "screen.availHeight",        "sah",
                     "screen.availWidth",         "saw",
                     "screen.height",             "sh",
                     "screen.width",              "sw",
                     "document.referrer",         "r",
                     "document.URL",              "du",
                     "document.lastModified",     "dl",
                     "error.name",                "ena",
                     "error.message",             "em",  /*IE*/
                     "error",                     "em",  /*FireFox y GWT*/
                     "error.description",         "ed",
                     "error.number",              "enu",
                     "error.url",                 "eu",
                     "error.linenumber",          "el",
                     "new Date().toGMTString()",  "ce"
                   ];

        message.uc = (isUncatch) ? isUncatch : false;

        /*dynamic properties*/
        var j;
        for (var i = 0; i < fields.length; i += 2) {
            try  {
                if (! message[fields[i + 1]]) {
                    message[fields[i + 1]] = eval(fields[i]);
                }
            } catch (e)   {
            }
        }

        /*plugins*/
        try {
            for (j = 0; j < navigator.plugins; j++) {
                message.pl += navigator.plugins[j].name + ":";
            }
        } catch (e) {
        }

        return message;
    };

    GWanted.ServerLogSink.prototype.sendGet = function (url, params) {
        var query = url + "?";

        for (var field in params) {
            query += field + "=" + escape(params[field]) + "&";
        }

        if (this.image) {
            this.image.src = query + "&id=" +  Math.random();
        }
    };

    /*----------------------------Widget Class----------------------------------*/

    /* Si en IE haces una invocación desde una ventana padre a una
     * función de una ventana hija dependiendo de como hagas la
     * invocación se hará o no correctamente el transpaso de la
     * información de error.  Suponemos que con varios frames
     * funciona correctamente.
     *     OK  : window.frames[0].f();
     *     FAIL: fRef = window.frames[0].f; fRef.call(window.frames[0]);
     * Por lo que hemos creado una función para recuperar un frame de GWT y así
     * poder realizar la invocación
     */
    GWanted.getFirstGwtFrame = function () {
        for (var i = 0 ; i < window.frames.length ; i++) {
            if (window.frames[i].throwNew3) {
                return window.frames[i];
            }
        }
    };

    GWanted.Widget = function (className, container) {
        this.instance  = null;
        this.className = className;
        this.container = container;
    };

    GWanted.Widget.prototype.fireOnError = function (error) {
        var cancelError = false; /*TODO: true?*/
        try {
            if (this.onerror) {
                cancelError = this.onerror(error);
            }
        } catch (ex) {
            GWanted.getFirstGwtFrame().
                    throwNew4("Error at user function onerror "  +
                              "in widget " + this.className,
                              this.className,
                              "fireOnError",
                              ex);
        }

        if (! cancelError) {
            GWanted.notifyException(error, this.container);
        }
    };

    GWanted.Widget.prototype.fireOnCreate = function () {
        var agent, self;
        if (this.oncreate) {
            try {
                agent = navigator.userAgent.toLowerCase();
                self = this;

                if (agent.indexOf("msie") !== -1) {
                    this.oncreate(this.instance);
                } else {
                    /* Se hace por con la activación del objeto EMBED
                     * de Flash, se tiene que esperar un cierto tiempo
                     * antes de realizar invocaciones.
                     */
                    window.setTimeout(function () {
                        try {
                            self.oncreate.call(self, self.instance);
                        } catch (ex1) {
                            self.fireOnError.call(self, ex1);
                            /* TODO: Se muestra al usuario
                             * como un error general.
                             * Ponemos un alert?
                             */
                        }
                    } , 200);
                }
            } catch (ex2) {
                GWanted.getFirstGwtFrame().
                        throwNew4("Error at user function oncreate " +
                                  "in widget " + this.className,
                                  this.className,
                                  "fireOnCreate",
                                  ex2);
            }
        }
    };

    /*----------------------------GWanted Class---------------------------------*/

    GWanted.showLoadingBanner = function (container, isShowLoading,
                                      isShowAccessible) {
        var loadingUrl, baseUrl;
        try {
			//Problems with the transformation of the innerHTML to the hosted mode
            container.accessibleHTML = new String(container.innerHTML);
            if (isShowLoading) {
                loadingUrl = this.getMetaProperty('loadingUrl');
                baseUrl    = this.getMetaProperty('baseUrl');
                if (!loadingUrl) {
                    loadingUrl = "img/loading.gif";
                    if (baseUrl) {
                        loadingUrl = baseUrl + loadingUrl;
                    }
                }

                container.innerHTML = '<span class="gwanted-core-SplashScreen">' +
                    '<img src="' + loadingUrl + '" alt="Loading1 ... " />' +
                    '</span>';
            } else if (!isShowAccessible) {
                container.innerHTML = '';
            }
        } catch (e) {
        }
    };

    GWanted.pendingCreates = [];
    GWanted.loadedModules  = [];

    GWanted.isModuleLoaded = function (moduleName) {
        for (var i = 0; i < this.loadedModules.length; i++) {
            if (this.loadedModules[i] === moduleName) {
                return true;
            }
        }

        return false;
    };

    GWanted.fireEvent = function (element, eventName, parameters) {
        var callback = element.__gwanted.widget[eventName];
        if ((callback) && (typeof callback === "function")) {
            callback.apply(element, parameters);
        }
    };

    GWanted.createEvent = function (element, eventName) {
        var onEvent = element.getAttribute(eventName);

        if ((onEvent) && (typeof onEvent === "string")) {
            element[eventName] =  new Function(onEvent);
        }
    };

    GWanted.createJSAttributes = function (element) {
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

    GWanted.createWidgetFromElement = function (element) {
        var gwtModule, javaClass;
        try {
            gwtModule = element.getAttribute("gwtModule");
            javaClass = element.getAttribute("javaClass");

            GWanted.createJSAttributes(element);
            GWanted.createEvent(element, "oncreate");
            GWanted.createEvent(element, "onerror");

            if ((gwtModule) && (javaClass)) {
                javaClass = javaClass.replace(/\./g, '_');
                GWanted.createWidget(element,
                                 gwtModule,
                                 javaClass,
                                 null,
                                 {
				                    oncreate: function () {
				                    	if (typeof element.oncreate == "function") {
				                            return element.oncreate(arguments);
				                        }
				                    },
				                    onerror: function () {
				                    	if (typeof element.onerror == "function") {
				                            return element.onerror(arguments);
				                        }
				                    }
                				  }
                                    );
            } else {
                if (element) {
                    element.innerHTML = "Invalid parameters. At least you " +
                                    "must define the gwtModule and "    +
                                    "javaClass properties";
                }
            }
        } catch (ex0) {
            if (element) {
                element.innerHTML = "Create widget exception: " + ex0.message;
            }
        }
    };

    GWanted.create = function (widget, className, container, params, createTimer) {
        var widgetName = className.replace(/\_/gi,".");
        var instance, elem;
        GWanted.TimeLogger.getInstance().currentWidgetName = widgetName;
        try {
            if (container.gwanted) {
                this.getFirstGwtFrame().
                    throwNew3("Container " + container.id + " already has a widget",
                              "GWanted",
                              "onModuleLoad");
            }
            if (widget.instance) {
                /*TODO: Lo ignoramos?, lo mostramos en la barra de estado?*/
                this.getFirstGwtFrame().
                        throwNew3("Widget already loaded",
                                  "GWanted",
                                  "onModuleLoad");
            }

            if (! GWanted[className]) { /*TODO: No funciona revisar*/
                this.getFirstGwtFrame().
                        throwNew3("The constructor of the class " + className +
                                  " was not found.\n Please check that the "  +
                                  "java class name would be rigth and that "  +
                                  "the class in GWT have the tag "            +
                                  "/***gwt.class visible=public*/",
                                  "GWanted",
                                  "onModuleLoad");
            }

            try {
                instance = eval("new GWanted." + className +
                                    "(container, params, container.accessibleHTML);");
                widget.instance = instance;

                //To map all public methods and events to the container
                container.gwanted = {};
                for (elem in instance) {
                    if (typeof instance[elem] === 'function') {
                        GWanted.addLogger(instance,elem,widgetName);
                    }
                    container.gwanted[elem] = instance[elem];
                }

                for (elem in widget) {
                    if (typeof widget[elem] === 'function') {
                        GWanted.addLogger(widget,elem,widgetName);
                        container.gwanted[elem] = widget[elem];
                    }
                }

                if (widget.instance.java_obj) {
                    widget.fireOnCreate();
                    /*TODO: See as retrieve an throw the exceptions*/
                }
            } catch (ex0) {
                this.getFirstGwtFrame().
                        throwNew4("The class " + className + " constructor "  +
                                  "throw an exception.",
                                  "GWanted",
                                  "onModuleLoad",
                                  ex0);
            }
        } catch (ex1) {
            widget.fireOnError(ex1);
        } finally {
            GWanted.TimeLogger.getInstance().currentWidgetName = null;
        }
        //Toma de tiempo de creación de widget
        GWanted.TimeLogger.getInstance().addWidgetCreateTime(createTimer,widgetName);
    };

    GWanted.createWidget = function (containerName, moduleName, className, params,
                                     events) {
        GWanted.createWidgetLoading(containerName, moduleName, className, true, params, events);
    };
    GWanted.createWidgetLoading = function (containerName, moduleName, className, isShowLoading, params,
                                     events) {
        console.warn('create widget' + moduleName);
        if (! moduleName) {
            throw new Error("To create a widget you must pass in the " +
                            "second parameter the GWT module name");
        }

        if (! className) {
            throw new Error("To create a widget you must pass in the " +
                            "third parameter the full qualify java class name.");
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

        var isShowAccessible = false;
        //separate ifs because sometimes JavaScript evaluates the if as a whole
        if (params !== null && params !== undefined) {
            if (params.length > 1) {
                isShowAccessible = params[1] === 'true';
            }
        }
        //Also sets container.accessibleHTML (to initial innerHTML)
        this.showLoadingBanner(container, isShowLoading, isShowAccessible);

        var widget                  = new GWanted.Widget(className, container);
        container.__gwanted         = {};
        container.__gwanted.widget  = widget;

        for (var property in events) {
            widget[property] = events[property];
        }
        console.warn('isload ' + moduleName + '?' + this.isModuleLoaded(moduleName));
        if (this.isModuleLoaded(moduleName)) {
            this.create(widget, className, container, params,timer);
        } else {
            this.pendingCreates.push(
                {
                moduleName    : moduleName,
                widget        : widget,
                className     : className,
                container     : container,
                params        : params,
                callback      : this.create,
                createTimer   : timer
            }
            );
        }
    };

    GWanted.onModuleLoad = function (moduleName) {
        var pendingCreate;
        var i = 0;
        console.warn('onload a' + moduleName);
        this.loadedModules.push(moduleName);

        while (i < this.pendingCreates.length) {
            pendingCreate = this.pendingCreates[i];

            if ((pendingCreate.moduleName) &&
                 (pendingCreate.moduleName === moduleName)) {
                try {
                    pendingCreate.callback.call(
                                            this,
                                            pendingCreate.widget,
                                            pendingCreate.className,
                                            pendingCreate.container,
                                            pendingCreate.params,
                                            pendingCreate.createTimer);
                } catch (ex) {
                    /*TODO: Lo ignoramos?, lo mostramos en la barra de estado?*/
                    this.getFirstGwtFrame().
                                throwNew4("Error creating widget " +
                                          "of the GWT module " + moduleName,
                                          "GWanted", "onModuleLoad", ex);
                }

                this.pendingCreates = this.pendingCreates.slice(0, i).
                                         concat(this.pendingCreates.slice(i + 1));
            } else {
                i++;
            }
        }
    };

    GWanted.metaProps = {};

    GWanted.processMetas = function () {
        var metas = document.getElementsByTagName("meta");
        var meta, name, value, content, eq;
        for (var i = 0, n = metas.length; i < n; ++i) {
            meta = metas[i];
            name = meta.getAttribute("name");
            if (name) {
                if (name === "gwanted:property") {
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

    GWanted.getMetaProperty = function (name) {
        var value = this.metaProps[name];
        if (value) {
            return value;
        } else {
            return null;
        }
    };

    GWanted.setMetaProperty = function (name, value) {
        this.metaProps[name] = value;
    };

    GWanted.processMetas();

    /*---------------------------ServerLogs Class-------------------------------*/
    /* Helper class for log data structure
     * Contenedor de medidas de timeLog
    */

    TimeLogBean = function (pEventType,pEventName,pName) {
        var undefined = "undefined";
        //Constantes: atributos
        var content = {};
        content.EventType = pEventType;
        content.EventName = pEventName;
        content.Name = pName;
        content.LoadTime = 0;
        content.LoadTimes = 0;
        content.ServerTime = 0;
        content.ServerRequests = 0;
        content.BrowserTime = 0;
        content.BrowserActions = 0;
        content.Errors = 0;
        content.BytesRecivedFromServer = 0;
        content.BytesSendToServer = 0;

        this.updateValue = function (attribute,value) {
            content[attribute] += value;
        };

        this.getAttribute = function (attribute) {
            return content[attribute];
        };

        this.toString = function () {
            var salida = "";
            for (var attribute in content) {
                salida += attribute + ":" + content[attribute] + ",";
            }
            return salida.substring(0,salida.length - 1);
        };
    };

    /**
    Constantes base para implementar en un futuro la activacion o desactivacion del log en distitos niveles
    */
    GWanted.NO_LOGGER = "NO_LOGGER";
    GWanted.WIDGET_LOGGER = "WIDGET_LOGGER";

    GWanted.TimeLogger = function () {
        this.loggerData = {};

        this.createWidgetBuffer = {}; //Buffer para la creacion de widgets
        this.widgetClientTimer = null; //Buffer para procesos de cliente
        this.callClientCount = 0; //Contador de procesos de cliente
        this.currenWidgetName;

        //Constantes: Valores validos de event type
        this.ET_MODULO = "Modulo";
        this.ET_WIDGET = "Widget";
        this.ET_EVENTO = "Evento";

    };

    //Captura del meta valor de nivel de log
    GWanted.loggerLevel = GWanted.getMetaProperty('serverLogLevel');
    GWanted.TimeLogger.url = GWanted.getMetaProperty('TIMERLOGGER_URL');
    //Por defecto, no se activa el log
    if (GWanted.loggerLevel === null || GWanted.TimeLogger.url === null) {
        GWanted.loggerLevel = GWanted.NO_LOGGER;
    }

    GWanted.TimeLogger.instance = null;

    GWanted.TimeLogger.LOGGER_URL = "../org.gwanted.gwt.widget.loggertable.module/loggerTable.html";
    GWanted.TimeLogger.windowLogger = function (url) {
        if (!url) {
            url = GWanted.TimeLogger.LOGGER_URL;
        }
        var id = "logger" + new Date().getTime();
        window.open(url, id, "resizable=yes,width=600,height=300,menubar=no,toolbar=no,location=no,scrollbars=yes");
    };

    /**
     * Return true if logger is active
    */
    GWanted.TimeLogger.prototype.isEnabled = function () {
        return GWanted.loggerLevel !== GWanted.NO_LOGGER;
    };


    if (GWanted.loggerLevel === GWanted.NO_LOGGER) {
        GWanted.TimeLogger.prototype.empty = function () {};
        GWanted.TimeLogger.prototype.toServerString         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addWidgetCreateTime     = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addServerEndTime         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addClientEndTime         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addClientStartTime         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addException    = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addModuleLoadTime     = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.addWidgetLoadTime         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.endRequest     = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.getCurrentWidgetName         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.getJSInstance         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.getTimer         = GWanted.TimeLogger.prototype.empty;
        GWanted.TimeLogger.prototype.isDataSent         = function(){return true;};
        GWanted.TimeLogger.prototype.isEnabled = function () {
            return false;
        };
        GWanted.TimeLogger.prototype.setDataSent         = GWanted.TimeLogger.prototype.empty;

    }

    if (GWanted.loggerLevel === GWanted.WIDGET_LOGGER) {

        GWanted.TimeLogger.prototype.toServerString = function () {
            var data;
            var salida = "data={";
            for (data in this.loggerData) {
                salida += "{" + this.loggerData[data].toString() + "},";
            }
            salida = salida.substring(0,salida.length - 1) + "}&WebPage=" + window.location.href;
            return salida;
        };

        /**
         * For java class use
         */
        GWanted.TimeLogger.prototype.getTimer = function () {
            return new LogTimer(true);
        };


        GWanted.TimeLogger.prototype.dataSent = false;

        /**
         * Save in log structure a log data
         */
        GWanted.TimeLogger.prototype.addTime = function (elementType,elementName,timeAttribute,countAttribute,timer) {
            var element = this.loggerData[elementName];
            if (!element) {
                //En un futuro se preve el log a nivel de evento, que deveria ser identificado en el segundo parametro
                element = this.loggerData[elementName] = new TimeLogBean(elementType,null,elementName);
            }
            if (countAttribute) {
                element.updateValue(countAttribute,1);
            }
            if (timeAttribute) {
                element.updateValue(timeAttribute,timer.stop());
            }
        };
        /**
         * moduleTimer is only one for all modules
         */
        GWanted.TimeLogger.prototype.addModuleLoadTime = function (moduleName) {
            this.addTime(this.ET_MODULO,moduleName,"LoadTime","LoadTimes",GWanted.__GWANTED_JS_LOAD_START_TIME);
            GWanted.__GWANTED_JS_LOAD_START_TIME.start();
        };
        //Find timer for load time with widgetId and add the measure to log data
        GWanted.TimeLogger.prototype.addWidgetCreateTime = function (createTimer,widgetName) {
            this.addTime(this.ET_WIDGET,widgetName,"LoadTime","LoadTimes",createTimer);
        };

        /**
         *
         */
        GWanted.TimeLogger.prototype.addServerEndTime = function (widgetName,timer) {
            this.addTime(this.ET_WIDGET,widgetName,"ServerTime","ServerRequests",timer);
        };

        /**
         *
        */
        GWanted.TimeLogger.prototype.addClientStartTime = function (widgetName) {
            if (this.widgetClientTimer === null) {
                this.widgetClientTimer = new LogTimer(true);
                this.callClientCount = 0;
                this.currentWidgetName = widgetName;
            } else {
                this.callClientCount++;
            }
        };

        GWanted.TimeLogger.prototype.addClientEndTime = function () {
            if (this.callClientCount > 0) {
                this.callClientCount--;
            } else {
                this.addTime(this.ET_WIDGET,this.currentWidgetName,"BrowserTime","BrowserActions",this.widgetClientTimer);
                this.widgetClientTimer = null;
                this.currentWidgetName = null;
            }
        };

        /**
         * Remove modalTime from current client widget time.
         */
        GWanted.TimeLogger.prototype.removeModalTime = function (modalTimer) {
            if (this.widgetClientTimer !== null) { //Evita problemas en llamadas fuera de gwanted
                this.widgetClientTimer.addTime(-(modalTimer.stop()));
            }
        };

        /**
         * Increment error count to widget in log data
         */
        GWanted.TimeLogger.prototype.addException = function () {
            this.addTime(this.ET_WIDGET, this.currentWidgetName, null, "Errors", new LogTimer(false));
        };

        GWanted.TimeLogger.prototype.isDataSent = function () {
            return this.dataSent;
        };

        GWanted.TimeLogger.prototype.setDataSent = function (isDataSent) {
            this.dataSent = isDataSent;
        };

        //ENDS if (GWanted.loggerLevel === GWanted.WIDGET_LOGGER)
    }

    GWanted.TimeLogger.getInstance = function () {
        if (GWanted.TimeLogger.instance === null) {
            GWanted.TimeLogger.instance = new GWanted.TimeLogger();
        }
        return GWanted.TimeLogger.instance;
    };

    /**
     * Esta función envuelve la funcion de un objeto con las capturas de tiempo para el logger
    */
    GWanted.addLogger = function (objeto, nombreFuncion, widgetName) {
        var funcionAnt =  objeto[nombreFuncion];
        objeto[nombreFuncion] = function () {
            GWanted.TimeLogger.getInstance().addClientStartTime(widgetName);
            try {
                return funcionAnt.apply(this,arguments);
            } finally {
                GWanted.TimeLogger.getInstance().addClientEndTime();
            }
        };
    };


    if (GWanted.loggerLevel === GWanted.WIDGET_LOGGER) {
        GWanted.redefineCallForAlert = function (newInnerFunction) {
            return redefinedFunction = function () {
                var item;
                var args = "";
                for (var i = 0; i < arguments.length; i++) {
                    item = arguments[i];
                    if (typeof item === "string") {
                        item = item.replace(/\n|\r\n/gi, "\\n");
                           args = args + '\'' + item + '\'';
                    } else {
                        args = args + item;
                    }
                    if ((i + 1) < arguments.length) {
                        args = args + ",";
                    }
                  }

              var t = new LogTimer(true);
              try {
                  var salida = eval(newInnerFunction + '(' + args + ')');
              } finally {
                  GWanted.TimeLogger.getInstance().removeModalTime(t);
              }
              return salida;
            };
        };

		(function(){
            //REDEFEFEF
	        var redefineFunctionsArray = ['window.confirm', 'window.alert', 'window.prompt'];
	        for (var i = 0; i < redefineFunctionsArray.length; i++) {
	            //create a new locator name for the function at window level.
	            //this is a pivot pointer for explorer problems with redeifining native javascript functions
	            var newInnerFunction = 'window.__redefinedFunction' + i;
	            //our new locator points to the modal window function
	            eval(newInnerFunction + ' = ' + redefineFunctionsArray[i]);
	            //gets new function that will call the new locator created that points to the
	            //So, this function will call inside the pivot function.
	            var newWrapperFunction = GWanted.redefineCallForAlert(newInnerFunction);
	            //now redefine modal window function to our new function that uses the pivot function
	            //that contains the pointer to the native function
	            eval(redefineFunctionsArray[i] + ' = newWrapperFunction');
    	    }
    	})();

        GWanted.redefineCallForTimer = function (newInnerTimer, oldTimer) {
            return redefinedNewInnerTimerFunction = function () {

                var currentWidgetName = GWanted.TimeLogger.getInstance().currentWidgetName;
                if (typeof arguments[0] === 'function') {
                    var functionCalled = arguments[0];
                    if (currentWidgetName === null) {
                        currentWidgetName = 'Timer';
                    }
                    var monitorFunction = function () {
                        GWanted.TimeLogger.getInstance().addClientStartTime(currentWidgetName);
                        try {
                            functionCalled();
                        } finally {
                        GWanted.TimeLogger.getInstance().addClientEndTime();
                        }
                    };
                    return eval(newInnerTimer + '( monitorFunction ,' + arguments[1] + ');');
                } else {
                    if (currentWidgetName === null) {
                        currentWidgetName = 'Timer';
                    }
                    var stringMonitorFunction = new String();
                    stringMonitorFunction = stringMonitorFunction + 'GWanted.TimeLogger.getInstance().addClientStartTime(\\\'' + currentWidgetName + '\\\'); ';
                    stringMonitorFunction = stringMonitorFunction + 'try { ';
                    stringMonitorFunction = stringMonitorFunction + arguments[0].replace(/\n|\r\n/gi,"\\n").replace(/([^\\])\'/gi,"$1\\\'");
                    stringMonitorFunction = stringMonitorFunction + '} finally { ';
                    stringMonitorFunction = stringMonitorFunction + 'GWanted.TimeLogger.getInstance().addClientEndTime(); ';
                    stringMonitorFunction = stringMonitorFunction + '} ';
                    return eval(newInnerTimer + '(\'' + stringMonitorFunction + '\',' + arguments[1]+ ');');
                }
            };
        };

        //See comments on previos function for redefine modal windows native javascript functions.
        (function(){
	        var redefineTimersArray = ['window.setTimeout', 'window.setInterval'];
	        for (var i = 0; i < redefineTimersArray.length; i++) {
	            var newInnerTimer = 'window.__redefinedTimer' + i;
	            eval(newInnerTimer + ' = ' + redefineTimersArray[i]);
	            var newWrapperTimer = GWanted.redefineCallForTimer(newInnerTimer, 'window.__redefinedTimer' + i); // redefineCallForAlert(eval('window.confirm'))
	            eval(redefineTimersArray[i] + ' = newWrapperTimer');
	        }
        }());
    }
    //fin TimerLogger

    /* GWanted Helper functions */

    GWanted.goTo = function goTo(url) {
        location.replace(url);
    };

    GWanted.concat = function () {
        var i;
        var r;
        r = "";
        for (i = 0; i < arguments.length; i++) {
            r += arguments[i];
        }
        return r;
    };

    GWanted.$ = function () {
        return '+';
    };

    /* Run */
    (function(){

	    if (GWanted) {
	        GWanted.serverLogSink = new GWanted.ServerLogSink(GWanted.getMetaProperty('serverLogUrl'));

	        if (!(GWanted.getMetaProperty('DisableCustomTags'))) {
	            // Hook the current window onload handler.
	            GWanted.oldHandler = window.onload;
	            window.onload  = function () {
	                try {
	                    var elements = document.getElementsByTagName("widget");

	                    if (elements.length === 0) { //To select custom tags in FireFox
	                        elements = document.getElementsByTagName("gwanted:widget");
	                    }

	                    for (var i = 0; i < elements.length; i++) {
	                        GWanted.createWidgetFromElement(elements[i]);
	                    }
	                } finally {
	                    if (GWanted.oldHandler) {
	                        GWanted.oldHandler();
	                    }
	                }
	            };

	            //FIXME: Used by WindowScrollManager because the definition of
	            // main window onscroll from the iframe doesn't run
	            // properly in IE
	            var oldOnScrollHandler = window.onscroll;

	            GWanted.onScrollHandler;

	            window.onscroll  = function () {
	                try {
	                    if (GWanted.onScrollHandler) {
	                        GWanted.onScrollHandler();
	                    }
	                } finally {
	                    if (oldOnScrollHandler) {
	                        oldOnScrollHandler();
	                    }
	                }
	            };
	            //WindowScrollManager EOF
	        }
	    }
	 })();

    GWanted.handleWrongProperty = function (propName,
                                            allowedValues,
                                            badValue) {
 	  if ((propName) && (propName == "user.agent")) {
	    var windowOnload = window.onload;
	    window.onload    = function () {
	      try {
		    var widget;
		    while (GWanted.pendingCreates.length > 0) {
		      widget = GWanted.pendingCreates.pop();
		      if (widget) {
		        widget.container.innerHTML = widget.container.accessibleHTML;
		      }
		    }
		    GWanted.serverLogSink.sendException(new Error("browserUnsupported"),
		                                        false);
	      } finally {
	        if (typeof windowOnload == 'function') {
			  windowOnload();
			}
		  }
	    }
      }
    };

}  //__GWANTED_JS_INCLUDED
