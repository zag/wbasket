package com.google.gwt.wbasket.client;

import org.timepedia.exporter.client.Exportable;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.AbsolutePanel;

public abstract  class WBase implements Exportable {
      public JsProperties jsProp;

	  public WBase(Element element, final JavaScriptObject  prop) {
		  AbsolutePanel container = null;
		  container = new WBasketPanel(element);
		  this.jsProp = new JsProperties(prop);
		  this.init_widget(container);
	  }
	  public abstract void init_widget ( AbsolutePanel container );

//	private void init_widget(AbsolutePanel container) {
		// TODO Auto-generated method stub
//	}
}