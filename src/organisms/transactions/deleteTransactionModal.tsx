import { deleteTransaction } from "@/lib/api/transactions";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import { Transaction } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type DeleteTransactionModalProps = {
    button?: React.ReactNode;
    transaction: Transaction;
}

export default function DeleteTransactionModal(props: DeleteTransactionModalProps) {
    const sw = useSwitch(false);
    const client = useQueryClient();
    const mutation = useMutation({ mutationFn: deleteTransaction, onSuccess: () => {
        toast.success("Transaction deleted");
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
                    <Button color="violet" title="Delete Transaction" onClick={sw.setTrue} />
                )
            }
            <ConfirmModal title="Delete Transaction" isOpen={sw.state} onClose={sw.setFalse} onConfirm={async () => await mutation.mutateAsync(props.transaction.id) } loading={mutation.isPending} >
                Are you sure you want to delete this transaction, this action <span className="text-red-500 font-bold">cannot</span> be undone.
            </ConfirmModal>
        </>
    )
}