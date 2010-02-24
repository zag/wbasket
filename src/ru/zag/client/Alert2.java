package ru.zag.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;

import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.VerticalPanel;

import org.timepedia.exporter.client.Exporter;
import org.timepedia.exporter.client.ExporterUtil;



/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class Alert2 implements EntryPoint {
    /**
   * This is the entry point method.
   */
  public void onModuleLoad() {
	  ((Exporter) GWT.create(Popup.class)).export();
	  ((Exporter) GWT.create(Para.class)).export();
	  //((Exporter) GWT.create(SimpleForm.class)).export();
	  //ExporterUtil.exportAll();
	  Log.fire("Onload"+ Popup.class);
	  onLoadImpl();
  
  }
  private native void onLoadImpl() /*-{
      if ($wnd.jscOnLoad && typeof $wnd.jscOnLoad == 'function') $wnd.jscOnLoad();
      if ($wnd.wimho && typeof $wnd.WBasket.onWBasket == 'function') $wnd.WBasket.onWBasket();
   }-*/; 
	  
  /*
     * Initialize this example.
	
	  @Override
	  public Widget onInitialize() {
		  VerticalPanel vPanel = new VerticalPanel();
		  vPanel.add(new Label("test label"));
		  return vPanel;
  
	  }
	  */
	}
