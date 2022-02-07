import { Color } from "three";
import { AbstractPropertyModel } from "./AbstractPropertyModel";
import { IPropertyChangeListener } from "./interfaces/IPropertyChangeListener";
import { ITunnelStyle } from "./interfaces/ITunnelStyle";
import { TunnelType } from "./interfaces/IMockData";
import * as THREE from "three";

export enum TunnelStyleProperty {
    SINGLE_COLOR = 'SINGLE_COLOR',
    OPACITY = 'OPACITY',
    TYPE = 'TYPE',
    ISOMETRIC_MODE = 'ISOMETRIC_MODE',
    TUNNEL_COLOR = 'TUNNEL_COLOR'
}

export class TunnelStyle extends AbstractPropertyModel implements ITunnelStyle {
    public ITunnelStyle: string = "ITunnelStyle";

    private color!: Color;
    private tunnelColor!: Color;
    private opacity!: number;
    private type!: TunnelType;
    private isometricMode!: boolean;

    constructor(listener?: IPropertyChangeListener) {
        super(listener);
        this.color = new THREE.Color(0x0000ff); // default color is BLUE
        this.tunnelColor = new THREE.Color(0xff0000); // default tunnel color is RED
        this.opacity = 1;
        this.type = TunnelType.NORMAL;
        this.isometricMode = false;
    }

    getTunnelColor(): Color {
        return this.tunnelColor;
    }

    setTunnelColor(color: Color): void {
        const oldValue = this.tunnelColor;
        this.tunnelColor = color;
        this.firePropertyChange(TunnelStyleProperty.TUNNEL_COLOR, oldValue, color, this);
    }

    setIsometricMode(value: boolean): void {
        const oldValue = this.isometricMode;
        this.isometricMode = value;
        this.firePropertyChange(TunnelStyleProperty.ISOMETRIC_MODE, oldValue, value, this);
    }

    isIsometricMode(): boolean {
        return this.isometricMode;
    }

    getType(): TunnelType {
        return this.type;
    }

    setType(type: TunnelType): void {
        const oldValue = this.type;
        this.type = type;
        this.firePropertyChange(TunnelStyleProperty.TYPE, oldValue, type, this);
    }

    getColor(): Color {
        return this.color;
    }

    setColor(color: Color): void {
        const oldValue = this.color;
        this.color = color;
        this.firePropertyChange(TunnelStyleProperty.SINGLE_COLOR, oldValue, color, this);
    }

    getOpacity(): number {
        return this.opacity;
    }

    setOpacity(opacity: number): void {
        const oldValue = this.opacity;
        this.opacity = opacity;
        this.firePropertyChange(TunnelStyleProperty.OPACITY, oldValue, opacity, this);
    }

    public getPropertyNames(): string[] {
        return Object.values(TunnelStyleProperty);
    }

    public getPropertyValue(property: string): any {
        switch (property) {
            case TunnelStyleProperty.SINGLE_COLOR:
                return this.getColor();
            case TunnelStyleProperty.OPACITY:
                return this.getOpacity();
            case TunnelStyleProperty.TYPE:
                return this.getType();
            case TunnelStyleProperty.TUNNEL_COLOR:
                return this.getTunnelColor();
            case TunnelStyleProperty.ISOMETRIC_MODE:
                return this.isIsometricMode();
        }
    }
}