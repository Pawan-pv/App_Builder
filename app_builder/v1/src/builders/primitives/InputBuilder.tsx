// src/builders/primitives/InputBuilder.tsx
import React, { useState, useEffect } from 'react';
import type { Widget } from '../../types';
import { setRuntimeValue, getRuntimeValue } from '../../runTimeEngine/runTimeStore';
import { resolveBinding } from '../../runTimeEngine/bindingResolver';
import { theme } from '../../theme';

interface InputBuilderProps {
    widget: Widget;
    isPreview?: boolean;
}

export function InputBuilder({ widget, isPreview = false }: InputBuilderProps) {
    const props = widget.props;
    const style = props.style || {};
    const content = props.content || {};

    // Resolve bindings
    const placeholder = resolveBinding(content.placeholder as string) || 'Enter text... ';
    const fieldName = content.fieldName as string || `input_${widget.id}`;
    const defaultValue = (content.defaultValue as string) || '';

    // Get or initialize value from runtime store
    const [value, setValue] = useState(() => {
        return getRuntimeValue(`form_${fieldName}`) || defaultValue;
    });

    // Handle changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        setRuntimeValue(`form_${fieldName}`, newValue);
    };

    // Reset when widget id changes
    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
            setRuntimeValue(`form_${fieldName}`, defaultValue);
        }
    }, [widget.id]);

    // Compute styles
    const computedStyle: React.CSSProperties = {
        backgroundColor: style.backgroundColor || '#ffffff',
        color: style.color || theme.colors.text,
        borderColor: style.borderColor || '#cbd5e1',
        fontSize: style.fontSize ? `${style.fontSize}px` : '14px',
        padding: '8px 12px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: `${style.borderRadius || 6}px`,
        width: '100%',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
    };

    return (
        <input
            type={(content.type as string) || 'text'}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={isPreview ? false : undefined}
            className="focus:outline-none focus:ring-2 focus:ring-teal-500"
            style={computedStyle}
            onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
            }}
            onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = 'none';
            }}
        />
    );
}