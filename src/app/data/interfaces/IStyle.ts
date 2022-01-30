import { Color } from "three";
import { IPropertyModel } from "./IPropertyModel";

export interface IStyle extends IPropertyModel {
    IStyle: string;

    getColor(): Color;

    setColor(color: Color): void;

    getOpacity(): number;

    setOpacity(opacity: number): void;
}
