import { IPropertyChangeListener } from "./IPropertyChangeListener";

export interface IPropertyModel {
    /**
     * user-defined type guard
     */
    IPropertyModel: string;
    /**
     * Adds a listener for changes to the specified property, if such defined; to any one otherwise.
     * @param listener The listener of property change event.
     * @param property The property being changed.
     */
    addPropertyChangeListener(listener: IPropertyChangeListener, property?: string): void;
    /**
     * Removes a listener for changes to the specified property, if such defined; to any one otherwise.
     * @param listener The listener to remove.
     * @param property The property.
     */
    removePropertyChangeListener(listener: IPropertyChangeListener, property?: string): void;
    /**
     * Determines whether this object has the specified property.
     * @param property The property name.
     * @returns true, if the property exists; false, otherwise.
     */
    hasProperty(property: string): boolean;
    /**
     * Gets the names of properties for thos object.
     * @returns An array of property names.
     */
    getPropertyNames(): string[];
    /**
     * Gets the value of the specified property.
     * @param property The property name.
     * @return The property value if such exists; null, otherwise.
     */
    getPropertyValue(property: string): any;
}