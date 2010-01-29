package ru.zag.client;

import com.google.gwt.core.client.JavaScriptObject;

public class jsAttr extends JavaScriptObject{
	// Overlay types always have protected, zero-arg ctors
    protected jsAttr() {
    }
public final String getRateSize (){
	//var h = (rate_size=="s")?12:17;
	return "12";    
    
}
}
