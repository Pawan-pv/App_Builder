import React from 'react';
import type { Widget } from '../../types';

interface GridViewBuilderProps {
    widget: Widget;
    children?: React.ReactNode;
}

export function GridViewBuilder({ widget, children }: GridViewBuilderProps) {
    const props = widget.props;
    const layout = props.layout || {};

    const computedStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${layout.columns || 2}, 1fr)`,
        gap: layout.gap ? `${layout.gap}px` : '8px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    };

    return (
        <div style={computedStyle}>
            {children}
            {!children && <div className="p-4 text-center text-gray-400 text-xs col-span-full">Grid View (Empty)</div>}
        </div>
    );
}
