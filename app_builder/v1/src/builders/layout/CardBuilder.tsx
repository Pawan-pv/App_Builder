import React from 'react';
import type { Widget } from '../../types';

interface CardBuilderProps {
    widget: Widget;
    children?: React.ReactNode;
}

export function CardBuilder({ widget, children }: CardBuilderProps) {
    const props = widget.props;
    const style = props.style || {};
    const layout = props.layout || {};

    const computedStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor || '#ffffff',
        borderRadius: `${style.borderRadius || 12}px`,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        padding: typeof layout.padding === 'number' ? `${layout.padding}px` : '16px', // Default padding
        display: 'flex',
        flexDirection: 'column',
        gap: layout.gap ? `${layout.gap}px` : '0px',
        width: '100%',
        height: 'auto',
    };

    return (
        <div style={computedStyle}>
            {children}
        </div>
    );
}
