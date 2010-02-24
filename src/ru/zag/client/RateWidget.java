package ru.zag.client;

import org.eclipse.jdt.internal.compiler.flow.FlowContext;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Element;
import com.google.gwt.jsonp.client.JsonpRequestBuilder;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.FlexTable;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Image;
import com.google.gwt.user.client.ui.Label;
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
public class RateWidget extends Composite implements RateLineClickHandler,
		RateLineMouseOutHandler, RateLineMouseOverHandler {

	interface MyCssResource extends CssResource {

		@ClassName("invisible-st")
		String invisibleSt();
	}

	interface Resource extends ClientBundle {
		@Source("res/RateWidget.css")
		MyCssResource css();
	}

	/*
	 * interface MyUiBinder extends UiBinder<Widget, RateWidget> {} private
	 * static MyUiBinder uiBinder = GWT.create(MyUiBinder.class);
	 * 
	 * @UiField ListBox listBox; public RateWidget(String... names) { // sets
	 * listBox initWidget(uiBinder.createAndBindUi(this)); for (String name :
	 * names) { listBox.addItem(name); } }
	 */

	private JsWidgetParams jsProp;
	private jsAttr attributes;
	private RateLine rate_line;
	Resource resources = GWT.create(Resource.class);
	private FlowPanel activity = new FlowPanel();
	private Element status_line = DOM.createElement("p");
	private Label fetchJsonpResultsLabel = new Label("");
	/*
	 * private static final String JSONP_URL =
	 * "http://spreadsheets.google.com/feeds/" + "list/" +
	 * "o01639138815242963973.2576643066438841202" + "/" + "od6" +
	 * "/public/values" + "?alt=json-in-script&callback=";
	 */
	private static final String JSONP_URL = "http://connector.imhonet.ru/distrib_api/50bbeadaa17f02e1fdf9f216af1e79b6/1210753367/37427125/1410/w_rate.json?on_get_rate=1&keywords=85174";

	public RateWidget(jsAttr prop) {
		this.jsProp = new JsWidgetParams(prop);
		attributes = prop;
		FlexTable t = new FlexTable();
		rate_line = new RateLine(10, jsProp.get("soid"));
		rate_line.addClickHandler(this);
		rate_line.addMouseOutHandler(this);
		rate_line.addMouseOverHandler(this);
		rate_line.initRateLine(0);
		t.setWidget(0, 0, rate_line);
		FlowPanel fp = new FlowPanel();
		fp.setStyleName("delete_rate");
		fp.getElement().getStyle().setProperty("visibility", "hidden");
		Image del_img = new Image(
				"http://connector.imhonet.ru/img/rate_null.gif");
		del_img.setStyleName("imhonet_rate_null");
		// del_img.setTitle("Сбросить оценку");
		del_img
				.setTitle("\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043e\u0446\u0435\u043d\u043a\u0443");
		fp.add(del_img);
		t.setText(0, 1, " ");
		t.setWidget(0, 2, fp);
		t.setText(0, 3, " ");
		// activity indicator
		Element aelem = activity.getElement();
		aelem.setId("activity_indicator_" + jsProp.get("soid"));
		aelem.getStyle().setPropertyPx("width", 20);
		aelem.getStyle().setPropertyPx("height", prop.getRateSize());
		aelem.getStyle().setProperty("background",
				"inherit  none no-repeat center bottom");
		// aelem.getStyle().setProperty("background-repeat", "no-repeat");
		// aelem.getStyle().setProperty("background-position", "center bottom");
		t.setWidget(0, 4, activity);

		FlowPanel container = new FlowPanel();
		container.getElement().setId("rate_cnt_" + jsProp.get("soid"));
		container.add(t);
		status_line.setClassName("desc_rate");
		status_line.setId("rate_p_" + jsProp.get("soid"));
		status_line.getStyle().setProperty("height", "1em");
		container.getElement().appendChild(status_line);
		status_line.setInnerText(" ");
		container.add(fetchJsonpResultsLabel);
		JsonpRequestBuilder jsonp = new JsonpRequestBuilder();

		String url = prop.getInitRateWidgetUrl();
		jsonp.requestObject(url, new AsyncCallback<JavaScriptObject>() {
			public void onFailure(Throwable throwable) {
				Log.fire("Error: " + throwable);
			}

			public void onSuccess(JavaScriptObject ans) {
				JsArray<JavaScriptObject> attr = (JsArray<JavaScriptObject>) ans;
				JsProperties jsProp = new JsProperties(attr.get(0));
				rate_line.setIdx(attributes.getRate2Idx(jsProp
						.get("current_rate")));
			}
		});
		// fetchJsonpResultsLabel.setText(url);
		// fetchJsonpStockData(JSONP_URL, RateWidget.this);
		initWidget(container);
	}

	@Override
	public void RateClicked(RateLineClickEvent event) {
		// TODO Auto-generated method stub
		// Window.alert("click"+ event.getIndex());
		JsonpRequestBuilder jsonp = new JsonpRequestBuilder();
		String url = attributes.getPostRateWidgetUrl(attributes.getIdx2Rate(
				event.getIndex()).getInt("value"));

		jsonp.requestObject(url, new AsyncCallback<JavaScriptObject>() {
			public void onFailure(Throwable throwable) {
				Log.fire("Error: " + throwable);
			}

			public void onSuccess(JavaScriptObject ans) {
				// JsArray<JavaScriptObject> attr = (JsArray<JavaScriptObject>)
				// ans;
				// JsProperties jsProp = new JsProperties(attr.get(0));
				// rate_line.setIdx(
				// attributes.getRate2Idx(jsProp.get("current_rate")) );
			}
		});

		rate_line.setIdx(event.getIndex());
	}

	@Override
	public void RateMouseOut(RateLineMouseOutEvent event) {
		status_line.setInnerText(attributes.getIdx2Rate(event.getIndex()).get(
				"text"));
	}

	@Override
	public void RateMouseOver(RateLineMouseOverEvent event) {
		status_line.setInnerText(attributes.getIdx2Rate(event.getIndex()).get(
				"text"));
	}

	/**
	 * Make call to remote server.
	 */
	public native static void fetchJsonpStockData(String url, RateWidget handler) /*-{
	 var callback ;
	do
	{
	callback = "callback" + Math.ceil( Math.random() * 100 )

	}
	while ( window[callback]);
	 // [1] Create a script element.
	 var script = document.createElement("script");
	 script.setAttribute("src", url+callback);
	 script.setAttribute("type", "text/javascript");

	 // [2] Define the callback function on the window object.
	 window[callback] = function(jsonObj) {
	   // [3]
	   handler.@ru.zag.client.RateWidget::handleJsonResponse(Lcom/google/gwt/core/client/JavaScriptObject;)(jsonObj);
	   window[callback + "done"] = true;
	 }

	 // [4] JSON download has 1-second timeout.
	 setTimeout(function() {
	   if (!window[callback + "done"]) {
	     handler.@ru.zag.client.RateWidget::handleJsonResponse(Lcom/google/gwt/core/client/JavaScriptObject;)(null);
	   }

	   // [5] Cleanup. Remove script and callback elements.
	   document.body.removeChild(script);
	   delete window[callback];
	   delete window[callback + "done"];
	 }, 1000);

	 // [6] Attach the script element to the document body.
	 document.body.appendChild(script);
	}-*/;

	/**
	 * Handle the response to the request for stock data from a remote server.
	 */
	public void handleJsonResponse(JavaScriptObject jso) {
		if (jso == null) {
			displayJsonpError("Couldn't retrieve JSON");
			return;
		}

		fetchJsonpResultsLabel.setText(jso.toString());
	}

	private void displayJsonpError(String error) {
		fetchJsonpResultsLabel.setText("ERROR: " + error);
	}

}
