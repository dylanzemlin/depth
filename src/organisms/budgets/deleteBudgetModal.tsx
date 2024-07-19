import { deleteBudget } from "@/lib/api/budgets";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import ConfirmModal from "@/molecules/modals/confirm-modal";
import { Budget } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type DeleteBudgetModalProps = {
    button?: React.ReactNode;
    budget: Budget;
}

export default function DeleteBudgetModal(props: DeleteBudgetModalProps) {
    const sw = useSwitch(false);
    const client = useQueryClient();
    const mutation = useMutation({ mutationFn: deleteBudget, onSuccess: () => {
        toast.success("Budget deleted");
        client.invalidateQueries({ queryKey: ["budgets"] });
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
                    <Button color="violet" title="Delete Budget" onClick={sw.setTrue} />
                )
            }
            <ConfirmModal title="Delete Budget" isOpen={sw.state} onClose={sw.setFalse} onConfirm={async () => await mutation.mutateAsync(props.budget.id) } loading={mutation.isPending} >
                Are you sure you want to delete this budget, this action <span className="text-red-500 font-bold">cannot</span> be undone.
            </ConfirmModal>
        </>
    )
}