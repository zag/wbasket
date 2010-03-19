package com.google.gwt.wbasket.client;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;

public class WDRequestBuilder extends RequestBuilder {
	 private class WDCallback implements RequestCallback {
		 final SimpleCallback  callback;
		  public WDCallback(SimpleCallback callback) {
		      this.callback = callback;
		    }
		@Override
		public void onError(Request request, Throwable exception) {
			// TODO Auto-generated method stub
			callback.onError(request, exception);
		}

		public void onResponseReceived(Request request, Response response) {
			if (200 == response.getStatusCode()) {
				JSONObject jso =  JSONParser.parse(response.getText()).isObject();
				JsProperties ans = new JsProperties( jso );
				if ( ans.defined("error") ) {
					onError(request, new Throwable( ans.get("error")));
				} else {
				callback.onSuccess( ans );
				}
				} else {
					onError(request, new Throwable(response.getText()));
				}
		}
	 }

	public WDRequestBuilder(Method httpMethod, String url) {
		super(httpMethod, url);
		// expect json
		this.setHeader("Accept", "application/javascript");
	}
    public static String addSlashIfNeeded(String s) {
        if (!s.endsWith("/")) {
                return s + "/";
        }
        return s;
}

 public Request sendRequest(String requestData, SimpleCallback callback)
      throws RequestException {
	 WDCallback wraper = new WDCallback( callback );
	 return sendRequest(requestData, wraper);
  }
	 
}