package ru.zag.client;
public class Log {
public static native void fire(String message) /*-{
 //$wnd.wimho.log.warn(message);
// console.warn(message);
 }-*/;

}
