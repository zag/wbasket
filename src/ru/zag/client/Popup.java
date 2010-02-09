package ru.zag.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Panel;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

import org.timepedia.exporter.client.Export;
import org.timepedia.exporter.client.ExportPackage;
import org.timepedia.exporter.client.Exportable;

import com.google.gwt.query.client.GQuery;
import com.google.gwt.query.client.Function;
import static com.google.gwt.query.client.Effects.Effects;
import com.google.gwt.query.client.Selector;
import com.google.gwt.query.client.Selectors;
import static com.google.gwt.query.client.GQuery.*;
import static com.google.gwt.query.client.css.CSS.*;
import static com.google.gwt.query.client.GQuery.$;
import static com.google.gwt.query.client.GQuery.$$;
import static com.google.gwt.query.client.GQuery.lazy;

@Export
@ExportPackage("WBasket")
public class Popup  implements Exportable {
	String teststr = "Hello:";
	private JsProperties jsProp;
	private RateWidget  RateLine;
	private jsAttr vars;  
	public Popup(Element element, final jsAttr prop) {
		this.jsProp = new JsProperties(prop);
	    JSONObject json = new JSONObject(prop);
	    vars = prop;
	    String box = jsProp.get("cid","none");
	    Log.fire("Init pop with cid: " + box);
	    try {
	    Log.fire("Init2 :"+json.get("cid").isString() );
	    } catch(Exception e) {
	    	Log.fire("Exception " + e.toString());
	    }
	    //String box1 = $$("{cid: 123123}").get("cid");//,"none");
	    //Log.fire("Test $$ for box1: " + box1);
		AbsolutePanel container = null;
		container = new WBasketPanel(element);
		final String soid =  "sadasdadasd";
		Button uploader = new Button(box);
		uploader.addClickHandler(new ClickHandler() { 
			public void onClick(ClickEvent click) {
				Log.fire("Click");
				$("#rate_cnt_"+ soid).click(lazy().fadeOut().done());
				jsProp.getClosure("onload").onChange(prop );
				
			}
		});
		HTMLPanel hpanel =new HTMLPanel(MakeStrForRate( 5, 2, soid));
		//container.add(uploader );
		  RateLine = new RateWidget( vars);
		  //RateLine = new RateWidget( "able", "baker", "charlie");
		container.add(RateLine);
		Log.fire("New Rate LIne!");
		//container.add(hpanel);
		Log.fire("create Popups to elem" );
	}
	
	private String MakeStrForRate(int count,int rate, String soid) {
		String cnt ="<div id='rate_cnt_"+ soid +"'><ul class='imhonet-rating'>";
	    cnt += "<li class='current-rating' style='width:"+(100/count)*rate+"%;'>stars</li>";
	   for (int i = 1; i <= count ; i++) {
	        cnt += "<li class='imhonet_star'><a href='#' title='"+i+" stars out of "+count+"' class='star_"+i+"'>"+i+"</a></li>";
	        }
	    cnt +="</ul><p class='desc_rate' style='height:1em;'>&nbsp;</p></div>";
		return cnt;
		
	}
	public String HelloMethod ( String name) {
		return teststr+name;
	
	}
	public void fireOnCreate() {
		Log.fire("asas");
	}
}
