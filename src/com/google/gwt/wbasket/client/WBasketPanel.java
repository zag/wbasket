package com.google.gwt.wbasket.client;

import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.AbsolutePanel;


public class WBasketPanel  extends AbsolutePanel {
  public WBasketPanel(final Element elem) {
    super();
    setElement(elem);
    onAttach();
  }

  public static WBasketPanel get(final Element elem) {
    return new WBasketPanel(elem);
  }
}
