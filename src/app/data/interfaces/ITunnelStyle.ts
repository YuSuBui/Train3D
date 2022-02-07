import { Color } from "three";
import { TunnelType } from "./IMockData";
import { IPropertyModel } from "./IPropertyModel";

export interface ITunnelStyle extends IPropertyModel {
    ITunnelStyle: string;

    getColor(): Color;

    setColor(color: Color): void;

    getTunnelColor(): Color;

    setTunnelColor(color: Color): void;

    getOpacity(): number;

    setOpacity(opacity: number): void;

    getType(): TunnelType;

    setType(type: TunnelType): void;

    setIsometricMode(value: boolean): void;

    isIsometricMode(): boolean;

}