declare module "react-simple-maps" {
    import * as React from "react";

    export interface ComposableMapProps {
        width?: number;
        height?: number;
        projection?: string | ((...args: any[]) => any);
        projectionConfig?: any;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    }
    export const ComposableMap: React.FC<ComposableMapProps>;

    export interface ZoomableGroupProps {
        center?: [number, number];
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        onMoveStart?: (...args: any[]) => void;
        onMoveEnd?: (...args: any[]) => void;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    }
    export const ZoomableGroup: React.FC<ZoomableGroupProps>;

    export interface GeographiesProps {
        geography?: string | Record<string, any> | string[];
        children?: (data: { geographies: any[] }) => React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
    }
    export const Geographies: React.FC<GeographiesProps>;

    export interface GeographyProps {
        geography?: any;
        onMouseEnter?: React.MouseEventHandler;
        onMouseLeave?: React.MouseEventHandler;
        onMouseDown?: React.MouseEventHandler;
        onMouseUp?: React.MouseEventHandler;
        onClick?: React.MouseEventHandler;
        style?: {
            default?: React.CSSProperties;
            hover?: React.CSSProperties;
            pressed?: React.CSSProperties;
        };
        className?: string;
    }
    export const Geography: React.FC<GeographyProps>;
}
