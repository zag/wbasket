package ru.zag.client;
import com.google.gwt.event.shared.GwtEvent;

public class RateLineMouseOverEvent extends GwtEvent<RateLineMouseOverHandler>{
	public static final GwtEvent.Type<RateLineMouseOverHandler> TYPE = new GwtEvent.Type<RateLineMouseOverHandler>();
	private int rate;

	@Override
	protected void dispatch(RateLineMouseOverHandler handler) {
		// TODO Auto-generated method stub
		handler.RateMouseOver(this);
	}

@Override
public com.google.gwt.event.shared.GwtEvent.Type<RateLineMouseOverHandler> getAssociatedType() {
	// TODO Auto-generated method stub
	return TYPE;
}
/* Event attributes */

 
public RateLineMouseOverEvent(int object ){
        this.rate = object;
}
public int getIndex () {
	return this.rate;
}
}
