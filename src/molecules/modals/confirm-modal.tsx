import React from "react";
import Button from "../buttons/button";
import Modal from "./modal";

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
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
}

export default function ConfirmModal(props: ModalProps) {
    const [loading, setLoading] = React.useState(false);

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} title={props.title} backdrop={props.backdrop} size={props.size} footer={
            <div className="flex justify-start gap-2">
                <Button loading={loading} size="sm" color="violet" title={props.confirmText ?? 'Confirm'} onClick={() => {
                    setLoading(true);
                    props.onConfirm?.().finally(() => setLoading(false));
                }} className={props.confirmClass} />
                <Button disabled={loading} size="sm" color="slate" title={props.cancelText ?? 'Cancel'} onClick={props.onClose} className={props.cancelClass} />
            </div>
        }>
            <div className="p-4 space-y-4">
                {props.children}
            </div>
        </Modal>
    )
}