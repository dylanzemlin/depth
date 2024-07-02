import React from "react";
import Button from "../buttons/button";

type ModalProps = {
    isOpen?: boolean;
    onConfirm?: () => Promise<void>;
    onClose?: () => void;
    cancelText?: string;
    confirmText?: string;
    cancelClass?: any;
    confirmClass?: any;
    children?: React.ReactNode;
    title?: string;
    backdrop?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
}

export default function ConfirmModal(props: ModalProps) {
    const [loading, setLoading] = React.useState(false);
    const openClasses = 'flex'
    const closeClasses = 'hidden'

    return (
        <div className={`${props.isOpen ? openClasses : closeClasses} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 justify-center items-center h-full w-full`} aria-modal={true} role="dialog">
            {
                (props.backdrop ?? true) && (
                    <div onClick={props.onClose} className="fixed top-0 right-0 z-40 w-full h-full bg-black backdrop-blur-sm bg-opacity-50" />
                )
            }

            <div className={`relative w-full max-w-${props.size || '2xl'} max-h-full z-50`}>
                <div className="bg-white rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {props.title}
                        </h3>
                        <button disabled={loading} onClick={props.onClose} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                            </svg>
                            <span className="sr-only">
                                Close modal
                            </span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                        {props.children}
                    </div>

                    {/* Footer */}
                    <div className="rounded-b border-t p-4">
                        <div className="flex justify-start gap-2">
                            <Button loading={loading} size="sm" color="violet" title={props.confirmText ?? 'Confirm'} onClick={() => {
                                setLoading(true);
                                props.onConfirm?.().finally(() => setLoading(false));
                            }} className={props.confirmClass} />
                            <Button disabled={loading} size="sm" color="slate" title={props.cancelText ?? 'Cancel'} onClick={props.onClose} className={props.cancelClass} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}