import React from 'react';
import type { Widget } from '../../types';


interface ContainerBuilderProps {
    widget: Widget;
    children?: React.ReactNode;
}

export function ContainerBuilder({ widget, children }: ContainerBuilderProps) {
    const props = widget.props;
    const style = props.style || {};
    const layout = props.layout || {};

    const computedStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor || 'transparent',
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
        padding: typeof layout.padding === 'number' ? `${layout.padding}px` : undefined, // simplified
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        border: style.borderColor ? `1px solid ${style.borderColor}` : undefined,
    };

    return (
        <div style={computedStyle}>
            {children}
        </div>
    );
}
