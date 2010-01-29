package ru.zag.client;

import com.google.gwt.core.client.JavaScriptObject;
import org.timepedia.exporter.client.Export;
import org.timepedia.exporter.client.ExportPackage;
import org.timepedia.exporter.client.Exportable;
@Export
@ExportPackage("WBasket")
public class Para implements Exportable {
	  private JsProperties jsProp;
	  public Para(JavaScriptObject prop) {
		  this.jsProp = new JsProperties(prop);	  
	  }
}
