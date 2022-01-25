import { IViewer } from "./interfaces/IViewer";
import { Viewer } from "./Viewer";

export class ViewerFactory {
    private viewer!: IViewer;

    constructor() { }

    public async createViewer(htmlElemId: string): Promise<IViewer> {
        this.viewer = new Viewer(htmlElemId);
        return this.viewer;
    }
}