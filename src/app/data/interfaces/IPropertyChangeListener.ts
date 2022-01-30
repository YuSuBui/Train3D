export interface IPropertyChangeListener {
    /**
     * user-defined type guard
     */
    IPropertyChangeListener: string;
    /**
     * A callback. This method gets called when a bound property is changed.
     * @param property The name of the changed property.
     * @param oldValue The last value of the property.
     * @param newValue The new value of the property.
     * @param object The object which property is changed.
     */
    onPropertyChange(property: string, oldValue: any, newValue: any, object: any): void | Promise<void>;
}