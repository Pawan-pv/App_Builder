import React from 'react';
import type { Widget } from '../../types';

interface ListViewBuilderProps {
    widget: Widget;
    children?: React.ReactNode;
}

export function ListViewBuilder({ widget, children }: ListViewBuilderProps) {
    const props = widget.props;
    const layout = props.layout || {};

    // In a real implementation this would iterate over data
    // For now we just render children which represent the template

    const computedStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: layout.gap ? `${layout.gap}px` : '8px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    };

    return (
        <div style={computedStyle}>
            {/* Mocking list items for visualization if no children or as template */}
            {children}
            {!children && <div className="p-4 text-center text-gray-400 text-xs">List View (Empty)</div>}
        </div>
    );
}
