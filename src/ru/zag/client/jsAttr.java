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

private native JavaScriptObject idx2rate ( int idx ) /*-{
	return $wnd.wimho.idx2rate(idx)
	
}-*/;

public final JsProperties  getIdx2Rate ( int idx ) {
	return new JsProperties(this.idx2rate(idx));
}

}
