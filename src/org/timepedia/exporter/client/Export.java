package org.timepedia.exporter.client;

import java.lang.annotation.Target;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

/**
 *
 */
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.CONSTRUCTOR,
         ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Export {
   String value() default "";
}
