import { deleteTransfer } from "@/lib/api/transfers";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import { Transaction } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type DeleteTransferModalProps = {
    button?: React.ReactNode;
    transfer: Transaction;
}

export default function DeleteTransferModal(props: DeleteTransferModalProps) {
    const sw = useSwitch(false);
    const client = useQueryClient();
    const mutation = useMutation({ mutationFn: deleteTransfer, onSuccess: () => {
        toast.success("Transfer deleted");
        client.invalidateQueries({ queryKey: ["transfers"] });
        client.invalidateQueries({ queryKey: ["transactions"] });
        sw.setFalse();
    }, onError: (error) => {
        toast.error(error.message);
    } });

    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Delete Transfer" onClick={sw.setTrue} />
                )
            }
            <ConfirmModal title="Delete Transfer" isOpen={sw.state} onClose={sw.setFalse} onConfirm={async () => await mutation.mutateAsync(props.transfer.id) } loading={mutation.isPending} >
                Are you sure you want to delete this Transfer? This action <span className="text-red-500 font-bold">cannot</span> be undone and all transactions related to this transfer <span className="text-red-500 font-bold">will</span> be deleted.
            </ConfirmModal>
        </>
    )
}