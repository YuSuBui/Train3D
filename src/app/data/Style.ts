import { Color } from "three";
import { AbstractPropertyModel } from "./AbstractPropertyModel";
import { IPropertyChangeListener } from "./interfaces/IPropertyChangeListener";
import { IStyle } from "./interfaces/IStyle";
import * as THREE from "three";

export enum StyleProperty {
    SINGLE_COLOR = 'SINGLE_COLOR',
    OPACITY = 'OPACITY'
}

export class Style extends AbstractPropertyModel implements IStyle {
    public IStyle: string = "IStyle";
    private color!: Color;
    private opacity!: number;

    constructor(listener?: IPropertyChangeListener) {
        super(listener);
        this.color = new THREE.Color(0x0000ff);
    }

    getColor(): Color {
        return this.color;
    }

    setColor(color: Color): void {
        const oldValue = this.color;
        this.color = color;
        this.firePropertyChange(StyleProperty.SINGLE_COLOR, oldValue, color, this);
    }
    getOpacity(): number {
        return this.opacity;
    }

    setOpacity(opacity: number): void {
        const oldValue = this.opacity;
        this.opacity = opacity;
        this.firePropertyChange(StyleProperty.OPACITY, oldValue, opacity, this);
    }

    public getPropertyNames(): string[] {
        return Object.values(StyleProperty);
    }

    public getPropertyValue(property: string): any {
        switch (property) {
            case StyleProperty.SINGLE_COLOR:
                return this.getColor();
            case StyleProperty.OPACITY:
                return this.getOpacity();
        }
    }
}