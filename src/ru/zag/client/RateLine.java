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
import com.google.gwt.event.shared.HandlerRegistration;
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
	private int current_idx = 0;
	private String soid;
	private HorizontalPanel horizpanel = new HorizontalPanel();
	private Element rate_container;
    private HandlerManager handlerList = new HandlerManager(null);

	public RateLine ( int count, String soid_id ) {
		RatesCount = count;
		soid = soid_id;
		rate_container = DOM.createDiv();
		rate_container.setId("rate_cnt_"+ soid);
		horizpanel.getElement().appendChild(rate_container);
		GQuery query = MakeQForRate( RatesCount,0).
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
	  Log.fire("-init Widget");
		initWidget(horizpanel);
		Log.fire("init Widget");
		
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
public void initRateLine ( int idx ) {
	current_idx= idx;
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
	    }).mouseover(new Function() {
            @Override
            public boolean f(Event e) {
  	    	  Integer num =  (Integer) $(e).data("idx");
         	 handlerList.fireEvent(new RateLineMouseOverEvent( num ) );
              return true;
            }
          }).mouseout(new Function() {
              @Override
              public boolean f(Event e) {
    	    	  //Integer num =  (Integer) $(e).data("idx");
           	 handlerList.fireEvent(new RateLineMouseOutEvent( current_idx ) );
                return true;
              }
            });
	
}
// 0, 1..10 ; 0 - empty rate
public void setIdx(int idx) {
	//setup current index
	current_idx= idx;
    int percents = (int) Math.floor(100/RatesCount)*(idx);
	$(".current-rating",rate_container ).css("width",percents + "%");
	String view = idx == 0 ?"hidden":"visible";
	$(".delete_rate", rate_container).css("visibility", view);

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
//EVENTS

public HandlerRegistration addClickHandler( RateLineClickHandler handler){
    return handlerList.addHandler(RateLineClickEvent.TYPE, handler);
}
public HandlerRegistration addMouseOverHandler(  RateLineMouseOverHandler handler){
    return handlerList.addHandler(RateLineMouseOverEvent.TYPE, handler);
}
public HandlerRegistration addMouseOutHandler( RateLineMouseOutHandler handler){
    return handlerList.addHandler(RateLineMouseOutEvent.TYPE, handler);
}

}