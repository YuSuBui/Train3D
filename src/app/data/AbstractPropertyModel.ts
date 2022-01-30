import { IPropertyChangeListener } from "./interfaces/IPropertyChangeListener";
import { IPropertyModel } from "./interfaces/IPropertyModel";

export abstract class AbstractPropertyModel implements IPropertyModel {
    public IPropertyModel = 'AbstractPropertyModel';

    private specializedListeners: IPropertyChangeListener[][] = [];

    private globalListeners: IPropertyChangeListener[] = [];

    protected constructor(listener?: IPropertyChangeListener) {
        if (listener) {
            this.globalListeners.push(listener);
        }
    }

    public addPropertyChangeListener(listener: IPropertyChangeListener, property?: string): void {
        if (!property) {
            if (this.globalListeners.indexOf(listener) < 0) {
                this.globalListeners.push(listener);
            }
        } else if (this.hasProperty(property)) {
            if (this.specializedListeners[property as any] === undefined) {
                this.specializedListeners[property as any] = [];
            }
            const propertyListeners = this.specializedListeners[property as any];
            if (propertyListeners.indexOf(listener) < 0) {
                propertyListeners.push(listener);
            }
        } else {
            throw new Error(`Object ${this} doesn't contain the property '${property}'`);
        }
    }

    public removePropertyChangeListener(listener: IPropertyChangeListener, property?: string): void {
        if (!property) {
            const id = this.globalListeners.indexOf(listener);
            if (id >= 0) {
                this.globalListeners.splice(id, 1);
            }
        } else if (this.hasProperty(property)) {
            const propertyListeners = this.specializedListeners[property as any];
            if (propertyListeners !== undefined) {
                const id = propertyListeners.indexOf(listener);
                if (id >= 0) {
                    propertyListeners.splice(id, 1);
                }
            }
        }
    }

    public hasProperty(property: string): boolean {
        const properties = this.getPropertyNames();
        return properties.indexOf(property) >= 0;
    }

    public abstract getPropertyNames(): string[];

    public abstract getPropertyValue(property: string): any;

    public async firePropertyChange(property: string, oldValue: any, newValue: any, object: any): Promise<void> {
        const responses = this.globalListeners.map(
            async (listener: IPropertyChangeListener) => {
                await listener.onPropertyChange(property, oldValue, newValue, object);
            }
        );
        const specListenersResponses = this.specializedListeners.map(
            async (specListener: IPropertyChangeListener[]) => {
                const listenerResponses = specListener.map(
                    async (listener: IPropertyChangeListener) => {
                        await listener.onPropertyChange(property, oldValue, newValue, object);
                    }
                );
                await Promise.all(listenerResponses);
            }
        );

        await Promise.all(responses);
        await Promise.all(specListenersResponses);
        return Promise.resolve();
    }
}