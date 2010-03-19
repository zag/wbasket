package com.google.gwt.wbasket.client;

import com.google.gwt.http.client.Request;

public interface  SimpleCallback {
	  /**
	   * Invoked if the asynchronous operation failed.
	   * @param e an exception describing the failure
	   */
	  void onError(Request request, Throwable exception);

	  /**
	   * Invoked if the asynchronous operation was successfully completed.
	   * @param resource the resource on which the operation was performed
	   */
	  void onSuccess(JsProperties resource);
	}
