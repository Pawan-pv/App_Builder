// src/builder/ActionEditor.tsx
import { useState } from 'react';
import type { WidgetAction, ActionTrigger, ActionType } from '../types';
import { Zap, Plus, Trash2, ChevronDown } from 'lucide-react';

interface ActionEditorProps {
    actions: WidgetAction[];
    onUpdate: (actions: WidgetAction[]) => void;
    availableScreens: Array<{ id: string; name: string }>;
}

export function ActionEditor({
    actions,
    onUpdate,
    availableScreens,
}: ActionEditorProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    /* ────────────────────────────────────────
       ADD ACTION
    ────────────────────────────────────────── */

    const addAction = () => {
        const newAction: WidgetAction = {
            id: `action_${Date.now()}`,
            trigger: 'onTap',
            type: 'alert',
            config: { message: 'Action triggered' },
        };
        onUpdate([...actions, newAction]);
        setExpandedId(newAction.id);
    };

    /* ────────────────────────────────────────
       UPDATE ACTION
    ────────────────────────────────────────── */

    const updateAction = (id: string, patch: Partial<WidgetAction>) => {
        const updated = actions.map((a) =>
            a.id === id ? { ...a, ...patch } : a
        );
        onUpdate(updated);
    };

    /* ────────────────────────────────────────
       DELETE ACTION
    ────────────────────────────────────────── */

    const deleteAction = (id: string) => {
        onUpdate(actions.filter((a) => a.id !== id));
    };

    /* ────────────────────────────────────────
       RENDER
    ────────────────────────────────────────── */

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <header className="flex items-center gap-2 text-xs uppercase font-bold">
                    <Zap size={12} /> Actions
                </header>
                <button
                    onClick={addAction}
                    className="p-1 rounded hover:bg-teal-50 text-teal-600 hover:text-teal-700 transition-all"
                    title="Add new action"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Action List */}
            {actions.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic px-2 py-2 bg-slate-50 rounded">
                    No actions.  Click + to add one.
                </p>
            ) : (
                <div className="space-y-2">
                    {actions.map((action) => (
                        <ActionItem
                            key={action.id}
                            action={action}
                            onUpdate={updateAction}
                            onDelete={deleteAction}
                            isExpanded={expandedId === action.id}
                            onToggle={() =>
                                setExpandedId(expandedId === action.id ? null : action.id)
                            }
                            availableScreens={availableScreens}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   ACTION ITEM
═══════════════════════════════════════════ */

function ActionItem({
    action,
    onUpdate,
    onDelete,
    isExpanded,
    onToggle,
    availableScreens,
}: {
    action: WidgetAction;
    onUpdate: (id: string, patch: Partial<WidgetAction>) => void;
    onDelete: (id: string) => void;
    isExpanded: boolean;
    onToggle: () => void;
    availableScreens: Array<{ id: string; name: string }>;
}) {
    return (
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            {/* ─── SUMMARY HEADER ─── */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-2 flex-1">
                    <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                    <div className="text-left flex-1">
                        <p className="text-xs font-bold uppercase text-slate-900">
                            {action.trigger} → {action.type}
                        </p>
                        <p className="text-[10px] text-slate-500">
                            {getActionDescription(action)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(action.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded text-red-500 flex-shrink-0 transition-colors"
                    title="Delete action"
                >
                    <Trash2 size={12} />
                </button>
            </button>

            {/* ─── EXPANDED CONFIG ─── */}
            {isExpanded && (
                <div className="border-t bg-slate-50 p-3 space-y-3">
                    {/* TRIGGER */}
                    <div>
                        <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                            When
                        </label>
                        <select
                            value={action.trigger}
                            onChange={(e) =>
                                onUpdate(action.id, {
                                    trigger: e.target.value as ActionTrigger,
                                })
                            }
                            className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                        >
                            <option value="onTap">On Tap/Click</option>
                            <option value="onSubmit">On Submit</option>
                            <option value="onLoad">On Load</option>
                        </select>
                    </div>

                    {/* ACTION TYPE */}
                    <div>
                        <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                            Action
                        </label>
                        <select
                            value={action.type}
                            onChange={(e) => {
                                const newType = e.target.value as ActionType;
                                const defaultConfigs: Record<ActionType, any> = {
                                    navigate: { targetScreenId: '' },
                                    alert: { message: 'Action completed!' },
                                    api: { url: '', method: 'GET' },
                                    submitForm: { fields: [] },
                                    if: { left: '' },
                                };

                                onUpdate(action.id, {
                                    type: newType,
                                    config: {
                                        ...action.config,
                                        ...defaultConfigs[newType],
                                    },
                                });
                            }}
                            className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                        >
                            <option value="alert">Show Alert</option>
                            <option value="navigate">Navigate to Screen</option>
                            <option value="api">API Call</option>
                            <option value="submitForm">Submit Form</option>
                            <option value="if">Condition (If/Else)</option>
                        </select>
                    </div>

                    {/* TYPE-SPECIFIC CONFIG */}
                    {action.type === 'navigate' && (
                        <div>
                            <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                                Target Screen
                            </label>
                            <select
                                value={action.config.targetScreenId || ''}
                                onChange={(e) =>
                                    onUpdate(action.id, {
                                        config: {
                                            ...action.config,
                                            targetScreenId: e.target.value,
                                        },
                                    })
                                }
                                className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                            >
                                <option value="">— Select Screen —</option>
                                {availableScreens.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            {!action.config.targetScreenId && (
                                <p className="text-[9px] text-red-500 mt-1">⚠️ Screen is required</p>
                            )}
                        </div>
                    )}

                    {action.type === 'alert' && (
                        <div>
                            <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                                Message
                            </label>
                            <input
                                type="text"
                                value={action.config.message || ''}
                                onChange={(e) =>
                                    onUpdate(action.id, {
                                        config: { ...action.config, message: e.target.value },
                                    })
                                }
                                className="w-full text-xs border border-slate-300 rounded p-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Enter message"
                            />
                        </div>
                    )}

                    {action.type === 'api' && (
                        <>
                            <div>
                                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                                    URL
                                </label>
                                <input
                                    type="text"
                                    value={action.config.url || ''}
                                    onChange={(e) =>
                                        onUpdate(action.id, {
                                            config: { ...action.config, url: e.target.value },
                                        })
                                    }
                                    className="w-full text-xs border border-slate-300 rounded p-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    placeholder="https://api.example.com/..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                                    Method
                                </label>
                                <select
                                    value={action.config.method || 'GET'}
                                    onChange={(e) =>
                                        onUpdate(action.id, {
                                            config: {
                                                ...action.config,
                                                method: e.target.value as 'GET' | 'POST',
                                            },
                                        })
                                    }
                                    className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-700">
                                    Store Response In
                                </label>
                                <input
                                    type="text"
                                    value={action.config.bindTo || ''}
                                    onChange={(e) =>
                                        onUpdate(action.id, {
                                            config: { ...action.config, bindTo: e.target.value },
                                        })
                                    }
                                    className="w-full text-xs border border-slate-300 rounded p-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    placeholder="e. g., apiResponse"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   HELPER:  GET ACTION DESCRIPTION
═══════════════════════════════════════════ */

function getActionDescription(action: WidgetAction): string {
    switch (action.type) {
        case 'navigate':
            return `Go to screen: "${action.config.targetScreenId || '(unset)'}"`;
        case 'alert':
            return `Show:  "${action.config.message || '(empty)'}..."`;
        case 'api':
            return `${action.config.method || 'GET'} ${action.config.url || '(no URL)'}`;
        case 'submitForm':
            return 'Submit form data';
        case 'if':
            return `If ${action.condition?.left || '... '}`;
        default:
            return '(unconfigured)';
    }
}