package ru.zag.client;
public class Log {
public static native void fire(String message) /*-{
 console.warn(message);
 }-*/;

}
