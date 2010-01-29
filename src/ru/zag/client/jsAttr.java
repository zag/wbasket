package ru.zag.client;

import com.google.gwt.core.client.JavaScriptObject;

public class jsAttr extends JavaScriptObject{
	// Overlay types always have protected, zero-arg ctors
    protected jsAttr() {
    }
public final int getRateSize (){
	//var h = (rate_size=="s")?12:17;
	return 12;    
    
}
private native JavaScriptObject defs () /*-{
	return $wnd.wimho.get_defs();
}-*/;

public final String getIdx2Rate ( int idx ) {
	
	JsProperties ind = new JsProperties (this.defs());
	JsProperties rate_ref = ind.getJsProperties("rate_custom");
	String[] names = rate_ref.keys();
	String res = "";
    for (String name : names) { 
	     //  res +=" "+name+ " " + rate_ref.get(name).getClass().toString()+"</br>";
    	  res +=" "+name;
	    }

	return res; 
	//JSONArray jaray ;
	//ind.getJsProperties()
	//return  ind.getJsProperties("rate_custom").;
	//return  ind.getJsProperties("encode");
}

}
