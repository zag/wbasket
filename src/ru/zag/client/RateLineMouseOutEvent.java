package ru.zag.client;

import com.google.gwt.event.shared.GwtEvent;

public class RateLineMouseOutEvent extends GwtEvent<RateLineMouseOutHandler> {
	public static final GwtEvent.Type<RateLineMouseOutHandler> TYPE = new GwtEvent.Type<RateLineMouseOutHandler>();
	private int rate;

	protected void dispatch(RateLineMouseOutHandler handler) {
		// TODO Auto-generated method stub
		handler.RateMouseOut(this);
	}

public com.google.gwt.event.shared.GwtEvent.Type<RateLineMouseOutHandler> getAssociatedType() {
	// TODO Auto-generated method stub
	return TYPE;
}
/* Event attributes */

 
public RateLineMouseOutEvent(int object ){
        this.rate = object;
}
public int getIndex () {
	return this.rate;
}
}
