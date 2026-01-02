import React from 'react';
import type { Widget } from '../../types';

interface RowBuilderProps {
    widget: Widget;
    children?: React.ReactNode;
}

export function RowBuilder({ widget, children }: RowBuilderProps) {
    const props = widget.props;
    const layout = props.layout || {};
    const style = props.style || {};

    const computedStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        gap: layout.gap ? `${layout.gap}px` : undefined,
        justifyContent: layout.mainAxisAlignment || 'flex-start',
        alignItems: layout.crossAxisAlignment || 'center',
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
