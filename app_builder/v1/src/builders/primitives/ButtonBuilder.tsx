import React from 'react';
import type { Widget } from '../../types';
import { resolveBinding } from '../../runTimeEngine/bindingResolver';
import { theme } from '../../theme';

interface ButtonBuilderProps {
    widget: Widget;
    isPreview?: boolean;
}

export function ButtonBuilder({ widget }: ButtonBuilderProps) {
    const props = widget.props;
    const style = props.style || {};
    const content = props.content || {};

    const label = resolveBinding(content.text as string) || 'Button';

    const computedStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor || theme.colors.primary,
        color: style.color || '#ffffff',
        fontSize: style.fontSize ? `${style.fontSize}px` : '14px',
        borderRadius: `${style.borderRadius || 8}px`,
        padding: '10px 16px',
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        textAlign: 'center',
        transition: 'opacity 0.2s',
    };

    return (
        <button
            style={computedStyle}
            type="button"
            className="hover:opacity-90 active:scale-95 transition-transform"
        >
            {label}
        </button>
    );
}
