package ru.zag.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.wbasket.client.JsProperties;
import com.google.gwt.wbasket.client.WBasketPanel;
import org.timepedia.exporter.client.Export;
import org.timepedia.exporter.client.ExportPackage;
import org.timepedia.exporter.client.Exportable;
@Export
@ExportPackage("WBasket")
public class Para implements Exportable {
	  private JsProperties jsProp;
	  public Para(Element element, final jsAttr prop) {
		  this.jsProp = new JsProperties(prop);
		  AbsolutePanel container = null;
		  container = new WBasketPanel(element);
		  String box = jsProp.get("text","none");
		  container.add(new Button(box));
	  }
}
