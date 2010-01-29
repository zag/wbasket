package ru.zag.client;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.Event;
import com.google.gwt.dom.client.Node;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.query.client.Function;
import com.google.gwt.query.client.GQuery;
//import com.google.gwt.query.client.Function;
import static com.google.gwt.query.client.Effects.Effects;
import com.google.gwt.query.client.Selector;
import com.google.gwt.query.client.Selectors;
import static com.google.gwt.query.client.GQuery.*;
import static com.google.gwt.query.client.css.CSS.*;
import static com.google.gwt.query.client.GQuery.$;
import static com.google.gwt.query.client.GQuery.$$;
import static com.google.gwt.query.client.GQuery.lazy;

public  class RateLine  extends Composite  {
	private int RatesCount = 0;
	private String soid;
	private HorizontalPanel horizpanel = new HorizontalPanel();
	private Element rate_container;
    private HandlerManager handlerList = new HandlerManager(null);

	public RateLine ( int count, String soid_id ) {
		RatesCount = count;
		soid = soid_id;
		rate_container = DOM.createDiv();
		rate_container.setId("Arate_cnt_"+ soid);
		horizpanel.getElement().appendChild(rate_container);
		GQuery query = MakeQForRate( RatesCount, 1).
	  		  mouseover(new Function() {
	              @Override
	              public boolean f(Event e) {
	                //$(e).as(Ratings).drain();
	                $(e).addClass("star-rating-hover");
	                return true;
	              }
	            });
	  GQuery cont = new GQuery(rate_container);
	  cont.append(query);
	  $(".imhonet_star",rate_container ).
	  click(new Function() {
	      @Override
	      public boolean f(Event e) {
	    	  Integer num =  (Integer) $(e).data("idx");
        	 handlerList.fireEvent(new RateLineClickEvent( num ) );
	        //$(e).addClass("star-rating-click").data("testpar",1);
        	 //Integer in = new Integer("");
        	 //in.
	        Log.fire("sadasd"+ $(e).getClass().getName()+ ":a data = "+ num );
	        return true;
	      }
	    });
	  Log.fire("-init Widget");
		initWidget(horizpanel);
		Log.fire("init Widget");
		
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

	private GQuery MakeQForRate(int count,int rate) {
		GQuery query = $("<ul class='imhonet-rating'>"
				+"<li class='current-rating' style='width:"+(100/count)*rate+"%;'>stars</li>"
				+"</ul>");
	   for (int i = 1; i <= count ; i++) {
		   String title = i+" stars out of "+count;
		   GQuery li = $("<li class='imhonet_star'><a href='#' title='"+
				   title
				   +"' class='star_"+i+"'>"+i
		   +"</a></li>");
		   li.data("idx", i);
		   query.append(li);
	        }
		return query;
	}

@Override
protected void onAttach() {
  Log.fire("+OnAttach");
  super.onAttach();
  Log.fire("-OnAttach");
  //checkResizeAndCenter();
}
@Override
protected void onLoad() {
  Log.fire("+ OnLoad");
  super.onLoad();
  Log.fire("- OnLoad");
}

}