package ru.zag.client;

import org.eclipse.jdt.internal.compiler.flow.FlowContext;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlexTable;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.resources.client.CssResource.ClassName;

/*
 * 
 *  
 *          cid: '1166810278',
 *          ssid: '2007061185867456052',
 *           soid: '555',
 *           sign: '1aff8937b79f9fb77dc3478e98bc853d'
 *   };
 *<div style="visibility: hidden;" class="delete_rate">
 *<img alt="сбросить" class="imhonet_rate_null"
 *title="Сбросить оценку" 
 *src="http://connector.imhonet.ru/img/rate_null.gif"/></div>
 */
public class RateWidget extends Composite {

	interface MyCssResource extends CssResource {
		  
		  @ClassName("invisible-st")
		  String invisibleSt();
		}
	interface Resource extends ClientBundle {
		  @Source("res/RateWidget.css")
		  MyCssResource css();
		}
/*
	interface MyUiBinder extends UiBinder<Widget, RateWidget> {}
	 private static MyUiBinder uiBinder = GWT.create(MyUiBinder.class);
	 @UiField ListBox listBox;
	 public RateWidget(String... names) {
		    // sets listBox
		    initWidget(uiBinder.createAndBindUi(this));
		    for (String name : names) { 
		      listBox.addItem(name); 
		    }
		  }
*/
	
 private JsProperties jsProp;
 Resource resources = GWT.create(Resource.class);

  public RateWidget (jsAttr prop ) {
	  this.jsProp = new JsProperties(prop);
	  FlexTable t = new FlexTable();
	  t.setWidget(0,0,new RateLine(10, jsProp.get("soid")));
	  FlowPanel fp = new FlowPanel();
	  fp.setStyleName("delete_rate");
	  fp.getElement().getStyle().setProperty("visibility", "hidden");
	  Image del_img = new Image("http://connector.imhonet.ru/img/rate_null.gif");
	  del_img.setStyleName("imhonet_rate_null");
	  //del_img.setTitle("Сбросить оценку");
	  del_img.setTitle("\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043e\u0446\u0435\u043d\u043a\u0443");
	  fp.add(del_img);
	  t.setText(0,1," ");
	  t.setWidget(0,2,fp);
	  t.setText(0,3," ");
	  //activity indicator
	  FlowPanel activity = new FlowPanel();
	  Element aelem =activity.getElement(); 
	  aelem.setId("activity_indicator_"+jsProp.get("soid"));
	  aelem.getStyle().setProperty("width", "20px" );
	  aelem.getStyle().setProperty("height",prop.getRateSize()+"px" );
	  aelem.getStyle().setProperty("background-repeat", "no-repeat");
	  aelem.getStyle().setProperty("background-position", "center bottom");
	  t.setWidget(0,4,activity);
	  
	  initWidget(t);
  }

}
