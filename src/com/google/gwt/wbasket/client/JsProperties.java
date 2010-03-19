/*
 * Copyright 2007 Manuel Carrasco Moñino. (manuel_carrasco at users.sourceforge.net) 
 * http://code.google.com/p/gwtchismes
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package com.google.gwt.wbasket.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;
import com.google.gwt.json.client.JSONObject;

public class JsProperties {

  JavaScriptObject p = null;

  public JsProperties(JavaScriptObject p) {
    this.p = p;
  }
  public JsProperties ( JSONObject p ) {
	  this.p = p.getJavaScriptObject();
  }

  public boolean defined(String name) {
    return definedImpl(p, name);
  }

  public String get(String name) {
    return getImpl(p, name, "");
  }

  public String get(String name, String deFault) {
    return getImpl(p, name, deFault);
  }

  public int getInt(String name, int deFault) {
    String val = defined(name) ? get(name).replaceAll("[^\\d]", "") : "";
    if (val.length() == 0)
      return deFault;
    return Integer.valueOf(val);
  }

  public int getInt(String name) {
    return getInt(name, 0);
  }

  public float getFloat(String name) {
    return getFloatImpl(p, name);
  }

  public boolean getBoolean(String name) {
    return getBoolean(name, false);
  }

  public boolean getBoolean(String name, boolean deFault) {
    String val = get(name).toLowerCase();
    if ("true".equals(val))
      return true;
    if ("false".equals(val))
      return true;
    if ("on".equals(val))
      return true;
    if ("off".equals(val))
      return false;
    if ("1".equals(val))
      return true;
    if ("0".equals(val))
      return false;
    return deFault;
  }

  public JsProperties getJsProperties(String name) {
    return new JsProperties(getJSObjectImpl(p, name));
  }

  public JsChangeClosure getClosure(String name) {
    return new JSChangeClosureImpl(getJSObjectImpl(p, name));
  }

  public final String[] keys() {
    JsArrayString a = keysImpl(p);
    String[] ret = new String[a.length()];
    for (int i = 0; i < a.length(); i++) {
      ret[i] = "" + a.get(i);
    }
    return ret;
  }
  public JavaScriptObject getJavaScriptObject(){
  	return this.p;
  }

  private static native boolean definedImpl(JavaScriptObject p, String name) /*-{
    return p[name] ? true : false;
  }-*/;

  private static native String getImpl(JavaScriptObject p, String name, String defa) /*-{
    return p[name] ? "" + p[name] : p[name] === false ? "false" : defa;
  }-*/;

  private static native float getFloatImpl(JavaScriptObject p, String name) /*-{
    return p[name] ? p[name]: 0;
  }-*/;

  private static native JavaScriptObject getJSObjectImpl(JavaScriptObject p, String name) /*-{
    return p[name] ? p[name] : null ;
  }-*/;

  private static final native JsArrayString keysImpl(JavaScriptObject p) /*-{
    var key, keys=[];
    for(key in p) keys.push("" + key); 
    return keys;
  }-*/;

  static private class JSChangeClosureImpl implements JsChangeClosure {
    JavaScriptObject jsobject;

    JSChangeClosureImpl(JavaScriptObject o) {
      jsobject = o;
    }

    public void onChange(Object object) {
      onChangeImpl(jsobject, object);
    }

    public native void onChangeImpl(JavaScriptObject f, Object o)/*-{
      if (f && o && typeof f == 'function') f(o);
    }-*/;
  }
 }
