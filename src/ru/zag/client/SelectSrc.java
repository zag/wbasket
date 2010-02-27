package ru.zag.client;

import org.timepedia.exporter.client.Export;
import org.timepedia.exporter.client.ExportPackage;
import org.timepedia.exporter.client.Exportable;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Anchor;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.UIObject;
import com.google.gwt.user.client.ui.Widget;

@Export
@ExportPackage("WBasket")
public class SelectSrc extends UIObject implements Exportable {
	  interface MyUi extends UiBinder<Widget, SelectSrc> {}
	  private static MyUi uiBinder = GWT.create(MyUi.class);
      @UiField SpanElement nameSpan;
      @UiField Label labelT;
      @UiField Anchor anchorLink;
      @UiHandler("anchorLink")
      void handleClick(ClickEvent e) {
        Window.alert("Hello, AJAX");
        
      }

	  private JsProperties jsProp;
	  
	  public SelectSrc(Element element, final jsAttr prop) {
	  
		  this.jsProp = new JsProperties(prop);
		  AbsolutePanel container = null;
		  container = new WBasketPanel(element);
		// createAndBindUi initializes this.nameSpan
         //setElement(uiBinder.createAndBindUi(this));
          //container.getElement().appendChild(uiBinder.createAndBindUi(this));
		  container.add(uiBinder.createAndBindUi(this));
		  String box = jsProp.get("text","none");
		  this.setName(jsProp.get("text","none"));
		  labelT.setText( labelT.getText() + " aa");
		  container.add(new Button(box));
	  }
	  public void setName (String name ) {
		  nameSpan.setInnerText(name);
	  }
}

