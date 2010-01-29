package ru.zag.client;
import com.google.gwt.event.shared.GwtEvent;

public class RateLineClickEvent extends GwtEvent<RateLineClickHandler>{
	public static final GwtEvent.Type<RateLineClickHandler> TYPE = new GwtEvent.Type<RateLineClickHandler>();
	private int rate;

	@Override
	protected void dispatch(RateLineClickHandler handler) {
		// TODO Auto-generated method stub
		handler.RateClicked(this);
	}

@Override
public com.google.gwt.event.shared.GwtEvent.Type<RateLineClickHandler> getAssociatedType() {
	// TODO Auto-generated method stub
	return TYPE;
}
/* Event attributes */

 
public RateLineClickEvent(int object ){
        this.rate = object;
}
public int getIndex () {
	return this.rate;
}
}
