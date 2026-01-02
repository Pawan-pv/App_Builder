import React from 'react';
import type { Widget } from '../../types';

interface ColumnBuilderProps {
    widget: Widget;
    children?: React.ReactNode;
}

export function ColumnBuilder({ widget, children }: ColumnBuilderProps) {
    const props = widget.props;
    const layout = props.layout || {};
    const style = props.style || {};

    const computedStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: layout.gap ? `${layout.gap}px` : undefined,
        justifyContent: layout.mainAxisAlignment || 'flex-start',
        alignItems: layout.crossAxisAlignment || 'stretch',
        backgroundColor: style.backgroundColor,
        padding: typeof layout.padding === 'number' ? `${layout.padding}px` : undefined,
        width: '100%',
        height: '100%',
    };

    return (
        <div style={computedStyle}>
            {children}
        </div>
    );
}
